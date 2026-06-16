/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-unsafe-function-type*/
import "reflect-metadata";

type Constructor<T = any> = new (...args: any[]) => T;

const IMPLEMENTATION_REGISTRY = new Map<Function, Constructor<any>[]>();
const PRIMARY_IMPLEMENTATIONS = new Map<Function, Constructor<any>>();
const ABSTRACT_CLASSES = new Set<Function>();
const ABSTRACT_IMPLEMENTATIONS = new Set<Function>();

class DependencyInjector {
  private instances = new Map<Constructor<any>, any>();

  get<T>(ctor: Constructor<T>): T {
    const targetCtor = this.resolveBinding(ctor);

    if (this.isAbstract(targetCtor)) {
      throw new Error(`Cannot instantiate abstract class: ${targetCtor.name}`);
    }

    if (this.instances.has(targetCtor)) {
      return this.instances.get(targetCtor);
    }

    const instance = new (targetCtor as new (...args: any[]) => T)();
    this.instances.set(targetCtor, instance);
    return instance;
  }

  private resolveBinding<T>(abstraction: Constructor<T>): Constructor<T> {
    if (!this.isAbstract(abstraction)) {
      return abstraction;
    }

    if (PRIMARY_IMPLEMENTATIONS.has(abstraction)) {
      return PRIMARY_IMPLEMENTATIONS.get(abstraction) as Constructor<T>;
    }

    const candidates = IMPLEMENTATION_REGISTRY.get(abstraction);
    if (candidates?.length === 1) {
      return candidates[0];
    }

    if ((candidates?.length ?? 0) > 1) {
      throw new Error(
        `Multiple implementations found for ${abstraction.name}. Use @Primary to mark one.`,
      );
    }

    throw new Error(
      `No implementation found for abstract class: ${abstraction.name}`,
    );
  }

  private isAbstract(fn: Function): boolean {
    return ABSTRACT_IMPLEMENTATIONS.has(fn);
  }
}

export function AbstractClass(): ClassDecorator {
  return (target) => {
    ABSTRACT_IMPLEMENTATIONS.add(target);
  };
}

export function Injectable<T extends Constructor<any>>(ctor: T) {
  const paramTypes = Reflect.getMetadata("design:paramtypes", ctor) || [];

  class InjectableWrapper extends ctor {
    constructor(...args: any[]) {
      const dependencies = paramTypes.map((dependencyCtor: Constructor<any>) =>
        dependencyInjector.get(dependencyCtor),
      );
      super(...dependencies);
    }
  }

  Object.setPrototypeOf(InjectableWrapper.prototype, ctor.prototype);
  Reflect.defineMetadata("design:paramtypes", paramTypes, InjectableWrapper);

  let proto = Object.getPrototypeOf(ctor);
  while (proto && proto !== Function.prototype) {
    if (typeof proto === "function" && ABSTRACT_IMPLEMENTATIONS.has(proto)) {
      const list = IMPLEMENTATION_REGISTRY.get(proto) || [];
      IMPLEMENTATION_REGISTRY.set(proto, [...list, InjectableWrapper]);
    }
    proto = Object.getPrototypeOf(proto);
  }

  return InjectableWrapper as T;
}

export function Primary<T extends new (...args: any[]) => any>(ctor: T): T {
  const wrapped = Injectable(ctor as Constructor<any>) as T;

  const proto = Object.getPrototypeOf(ctor);
  if (
    proto &&
    typeof proto === "function" &&
    ABSTRACT_IMPLEMENTATIONS.has(proto)
  ) {
    PRIMARY_IMPLEMENTATIONS.set(proto, wrapped as Constructor<any>);
  }

  return wrapped;
}

export const dependencyInjector = new DependencyInjector();

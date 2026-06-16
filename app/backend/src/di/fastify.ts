/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-unsafe-function-type*/
/* eslint-disable @typescript-eslint/no-wrapper-object-types*/

import "reflect-metadata";

import type {
  FastifyInstance,
  RouteOptions,
  preHandlerHookHandler,
} from "fastify";
import { z, ZodType } from "zod";
import fromZodSchema from "zod-to-json-schema";
import { dependencyInjector } from "./injector";
import type { ZodTypeDef } from "zod/v3";

const CONTROLLER_KEY = Symbol("controller");
const ROUTES_KEY = Symbol("routes");
const GLOBAL_SCHEMA_REGISTRY = new Map<z.ZodTypeAny, { $ref: string }>();

function registerZodSchemaToApp(
  app: FastifyInstance,
  schema: z.ZodTypeAny<any, ZodTypeDef, any>,
): { $ref: string } {
  if (!GLOBAL_SCHEMA_REGISTRY.has(schema)) {
    const jsonSchema = fromZodSchema(schema as any, {
      target: "openApi3",
    });
    const refId =
      schema.description || `schema-${Math.random().toString(36).slice(2)}`;

    const fullSchema = {
      ...jsonSchema,
      $id: refId,
    };

    app.addSchema(fullSchema);
    GLOBAL_SCHEMA_REGISTRY.set(schema, { $ref: refId });
  }
  return GLOBAL_SCHEMA_REGISTRY.get(schema)!;
}

export function Controller(prefix: string = ""): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CONTROLLER_KEY, prefix, target);
  };
}

export function Get(path: string): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const routes = Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];
    routes.push({
      method: "GET",
      path,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
  };
}

export function Post(path: string): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const routes = Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];
    routes.push({
      method: "POST",
      path,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
  };
}

export function Put(path: string): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const routes = Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];
    routes.push({
      method: "PUT",
      path,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
  };
}

export function Patch(path: string): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const routes = Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];
    routes.push({
      method: "PATCH",
      path,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
  };
}

export function Delete(path: string): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const routes = Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];
    routes.push({
      method: "Delete",
      path,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
  };
}

export function ParamSchema(schema: z.ZodTypeAny): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(`params:${String(propertyKey)}`, schema, target);
  };
}

export function QuerySchema(schema: z.ZodTypeAny): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(`query:${String(propertyKey)}`, schema, target);
  };
}

export function BodySchema(schema: z.ZodTypeAny): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(`body:${String(propertyKey)}`, schema, target);
  };
}

export function ResponseSchema(schema: z.ZodTypeAny): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(`response:${String(propertyKey)}`, schema, target);
  };
}

export function Summary(summary: string): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(`summary:${String(propertyKey)}`, summary, target);
  };
}

export function Tag(tag: string): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(`tag:${String(propertyKey)}`, tag, target);
  };
}

export function Use(
  middleware: preHandlerHookHandler | preHandlerHookHandler[],
): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      `middleware:${String(propertyKey)}`,
      Array.isArray(middleware) ? middleware : [middleware],
      target,
    );
  };
}

// core/route-loader.ts
export async function registerControllers(
  app: FastifyInstance,
  controllers: any[],
) {
  for (const ControllerClass of controllers) {
    const prefix = Reflect.getMetadata(CONTROLLER_KEY, ControllerClass);
    const instance = dependencyInjector.get(
      ControllerClass,
    ) as typeof ControllerClass;
    const routes = Reflect.getMetadata(ROUTES_KEY, ControllerClass) || [];

    for (const route of routes) {
      const handler = instance[route.handlerName].bind(instance);

      const paramsSchema = Reflect.getMetadata(
        `params:${String(route.handlerName)}`,
        instance,
      );
      const querySchema = Reflect.getMetadata(
        `query:${String(route.handlerName)}`,
        instance,
      );
      const bodySchema = Reflect.getMetadata(
        `body:${String(route.handlerName)}`,
        instance,
      );
      const responseSchema = Reflect.getMetadata(
        `response:${String(route.handlerName)}`,
        instance,
      );
      const summary = Reflect.getMetadata(
        `summary:${String(route.handlerName)}`,
        instance,
      );
      const tag = Reflect.getMetadata(
        `tag:${String(route.handlerName)}`,
        instance,
      );
      const middleware = Reflect.getMetadata(
        `middleware:${String(route.handlerName)}`,
        instance,
      );

      const schema: Record<string, any> = {};
      if (paramsSchema)
        schema.params = registerZodSchemaToApp(app, paramsSchema);
      if (querySchema)
        schema.querystring = registerZodSchemaToApp(app, querySchema);
      if (bodySchema) schema.body = registerZodSchemaToApp(app, bodySchema);
      if (responseSchema)
        schema.response = { 200: registerZodSchemaToApp(app, responseSchema) };
      if (summary) schema.summary = summary;
      if (tag) schema.tags = [tag];

      const options: RouteOptions = {
        method: route.method,
        url: `${prefix}${route.path}`,
        handler,
        schema,
      };

      if (middleware) {
        options.preHandler = middleware;
      }

      app.route(options);
    }
  }
}

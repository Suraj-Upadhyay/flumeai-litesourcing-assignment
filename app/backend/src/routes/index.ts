import type { FastifyPluginAsync } from "fastify";
import { authRouter } from "@domains/auth/auth.route";
import { sourcingRouter } from "@domains/supplier/supplier.route";
import { categoryRouter } from "@domains/category/category.route";
import { countryRouter } from "@domains/country/country.route";
import { productRouter } from "@domains/product/product.route";
import { projectRouter } from "@domains/project/project.route";
import { uomRouter } from "@domains/uom/uom.route";

export const routes: { prefix: string; plugin: FastifyPluginAsync }[] = [
  { prefix: "/auth", plugin: authRouter },
  { prefix: "/sourcing", plugin: sourcingRouter },
  { prefix: "/category", plugin: categoryRouter },
  { prefix: "/country", plugin: countryRouter },
  { prefix: "/product", plugin: productRouter },
  { prefix: "/project", plugin: projectRouter },
  { prefix: "/uom", plugin: uomRouter },
];

const v1Router: FastifyPluginAsync = async (app) => {
  for (const { plugin, prefix } of routes) {
    await app.register(plugin, { prefix });
  }
};

export { v1Router };

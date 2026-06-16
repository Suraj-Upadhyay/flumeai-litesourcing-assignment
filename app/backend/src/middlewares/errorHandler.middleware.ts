/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { FastifyError, FastifyPluginAsync } from "fastify";
import { ApiError } from "@/utility";

/**
 * Error handling middleware for Express.
 * This middleware captures errors thrown in the application and sends
 * appropriate responses based on the type of error.
 *
 * @param err - The error object that was thrown
 * @param _ - The Express request object (not used)
 * @param res - The Express response object
 * @param __ - The Express next function (not used)
 * @returns void
 */
const errorHandler: FastifyPluginAsync = async (app) => {
  // Check if the error is an instance of ApiError
  app.setErrorHandler((err: FastifyError, request, reply) => {
    console.error(err.stack); // Always log the stack trace

    if (err instanceof ApiError) {
      return reply.status(err.status).send(err);
    }

    if (err instanceof Error) {
      return reply.status(500).send({
        status: 500,
        message: err.name,
        errors: err.message,
        success: false,
        data: null,
      });
    }

    // Handle truly unknown errors
    console.error("Unexpected error caught:", err);
    return reply.status(500).send({
      status: 500,
      message: "Internal Server Error",
      success: false,
      data: null,
    });
  });
};

export default errorHandler;

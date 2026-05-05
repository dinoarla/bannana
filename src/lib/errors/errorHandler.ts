import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./AppError";

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: error.issues[0]?.message ?? "Input tidak valid." } },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }

  console.error(error);
  return NextResponse.json(
    { success: false, error: { code: "INTERNAL_ERROR", message: "Ada yang error, maaf ya." } },
    { status: 500 }
  );
}

"use server";

import { promises as fsPromises } from "fs";
import os from "os";
import path from "path";
import pdfParse from "pdf-parse";

/**
 * Parses a PDF file buffer and returns the text content
 * This function runs only on the server
 * @param {Buffer} pdfBuffer - The PDF file as a buffer
 * @returns {Promise<string>} - The parsed text from the PDF
 */
export async function parsePdfBuffer(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF file");
  }
}

/**
 * Parses a PDF file from a temporary path and returns the text content
 * This function runs only on the server
 * @param {string} tempFilePath - The path to the temporary file
 * @returns {Promise<string>} - The parsed text from the PDF
 */
export async function parsePdfFromPath(tempFilePath) {
  try {
    const pdfBuffer = await fsPromises.readFile(tempFilePath);
    return await parsePdfBuffer(pdfBuffer);
  } catch (error) {
    console.error("Error reading or parsing PDF:", error);
    throw new Error("Failed to read or parse PDF file");
  }
}

/**
 * Saves a file buffer to a temporary location
 * @param {Buffer} fileBuffer - The file as a buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - Path to the temporary file
 */
export async function saveToTemp(fileBuffer, fileName) {
  const tempDir = path.join(os.tmpdir(), "resumebuilder-uploads");

  try {
    // Ensure temp directory exists
    await fsPromises.mkdir(tempDir, { recursive: true });

    const tempFilePath = path.join(tempDir, `${Date.now()}-${fileName}`);
    await fsPromises.writeFile(tempFilePath, fileBuffer);

    return tempFilePath;
  } catch (error) {
    console.error("Error saving file to temp:", error);
    throw new Error("Failed to save file temporarily");
  }
}

/**
 * Cleans up temporary files
 * @param {string} tempFilePath - Path to the temporary file
 */
export async function cleanupTemp(tempFilePath) {
  try {
    await fsPromises.unlink(tempFilePath);
  } catch (error) {
    console.error("Error cleaning up temp file:", error);
  }
}

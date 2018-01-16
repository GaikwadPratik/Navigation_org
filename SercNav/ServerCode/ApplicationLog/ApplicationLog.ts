import * as fs from 'fs';

/**
 * Function to log exception message.
 * @param err {Error} error to be logged during debug mode
 */
export function LogException(err: Error): void {
    console.log(`An error with name: '${err.name}', message: ${err.message} and stackstrace: ${err.stack}`);
}

/**
 * Function to log error
 * @param errorMessage {string} errorMessage to be logged during error mode
 */
export function LogError(errorMessage: Error): void {
    console.log(errorMessage);
}

/**
 * Function to warning error
 * @param errorMessage  {string} errorMessage to be logged during warning mode
 */
export function LogWarning(errorMessage: string): void {
    console.log(errorMessage);
}

/**
 * Function to informational error
 * @param errorMessage  {string} errorMessage to be logged during info mode
 */
export function LogInfo(errorMessage: string): void {
    console.log(errorMessage);
}

/**
 * Function to Debug error
 * @param errorMessage  {string} errorMessage to be logged during debug mode
 */
export function LogDebug(errorMessage: string): void {
    console.log(errorMessage);
}

import { Response } from "express";

export const sendSuccessResponse = (
    res: Response,
    message: string,
    data: any = null,
    statusCode: number = 200
): Response => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    })
}
import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { IssuedTokens } from "../../domain/services/token.service";

const isProd = process.env.NODE_ENV === "production";
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

@Injectable()
export class CookieService {
  setAuthCookies(res: Response, tokens: IssuedTokens, rememberMe: boolean): void {
    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: rememberMe ? TWO_DAYS_MS : FOUR_HOURS_MS,
      path: "/auth/refresh",
    });
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
  }
}
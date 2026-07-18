import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { IssuedTokens } from "../../domain/services/token.service";

const isProd = process.env.NODE_ENV === "production";
const FIFTEEN_MIN_MS = 15 * 60 * 1000;
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

@Injectable()
export class CookieService {
  setAuthCookies(res: Response, tokens: IssuedTokens, rememberMe: boolean): void {
    const sessionMaxAge = rememberMe ? TWO_DAYS_MS : FOUR_HOURS_MS;

    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: FIFTEEN_MIN_MS,
      path: "/",
    });

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: sessionMaxAge,
      path: "/auth/refresh",
    });

    res.cookie("session_active", "1", {
      httpOnly: false,
      secure: isProd,
      sameSite: "strict",
      maxAge: sessionMaxAge,
      path: "/",
    });
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
    res.clearCookie("session_active", { path: "/" });
  }
}
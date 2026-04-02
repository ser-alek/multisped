"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MissionVision() {
  const t = useTranslations("missionVision");
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const cvs = canvasRef.current;
    if (!section || !cvs || initedRef.current) return;
    initedRef.current = true;

    const ctx = cvs.getContext("2d")!;
    let W = 0;
    let H = 0;
    let animId = 0;

    function cssVar(n: string) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(n)
        .trim();
    }

    function resize() {
      W = section!.offsetWidth;
      H = section!.offsetHeight;
      cvs!.width = W * devicePixelRatio;
      cvs!.height = H * devicePixelRatio;
      cvs!.style.width = W + "px";
      cvs!.style.height = H + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    function buildRoutes() {
      const isMobile = W < 600;
      const pad = 16;
      const safeH = isMobile ? H * 0.10 : H * 0.16;
      const safeX = isMobile ? W * 0.28 : W * 0.18;
      const R = 28;

      const TL = {
        pts: [
          [pad + safeX * 0.55, 0],
          [pad + safeX * 0.55, safeH * 0.55],
          [pad, safeH * 0.55],
          [pad, safeH * 0.95],
        ],
        r: R,
        dur: 3600,
        delay: 0,
      };

      const TR = {
        pts: [
          [W - pad - safeX * 0.55, 0],
          [W - pad - safeX * 0.55, safeH * 0.6],
          [W - pad, safeH * 0.6],
          [W - pad, safeH * 0.95],
        ],
        r: R,
        dur: 4000,
        delay: 500,
      };

      const BL_mobile = {
        pts: [
          [pad, H],
          [pad, H - safeH * 0.85],
          [pad + safeX * 0.5, H - safeH * 0.85],
          [pad + safeX * 0.5, H - safeH * 0.4],
        ],
        r: R,
        dur: 3800,
        delay: 250,
      };

      const BL_desktop = {
        pts: [
          [pad, H],
          [pad, H - safeH * 0.95],
          [pad + safeX * 0.6, H - safeH * 0.95],
          [pad + safeX * 0.6, H - safeH * 0.5],
        ],
        r: R,
        dur: 3800,
        delay: 250,
      };

      const BR = {
        pts: [
          [W - pad - safeX * 0.45, H],
          [W - pad - safeX * 0.45, H - safeH * 0.85],
          [W - pad, H - safeH * 0.85],
          [W - pad, H - safeH * 0.4],
        ],
        r: R,
        dur: 4400,
        delay: 900,
      };

      if (isMobile) return [TL, TR, BL_mobile];
      return [TL, TR, BL_desktop, BR];
    }

    function samplePath(pts: number[][], r: number, n = 300) {
      const res: number[][] = [];
      if (pts.length < 2) return res;
      const segs: any[] = [];
      let cur = [pts[0][0], pts[0][1]];
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i - 1],
          b = pts[i],
          c = pts[i + 1];
        const dx1 = b[0] - a[0],
          dy1 = b[1] - a[1];
        const dx2 = c[0] - b[0],
          dy2 = c[1] - b[1];
        const l1 = Math.hypot(dx1, dy1) || 1e-9,
          l2 = Math.hypot(dx2, dy2) || 1e-9;
        const rad = Math.min(r, l1 / 2, l2 / 2);
        const t1x = b[0] - (dx1 / l1) * rad,
          t1y = b[1] - (dy1 / l1) * rad;
        const t2x = b[0] + (dx2 / l2) * rad,
          t2y = b[1] + (dy2 / l2) * rad;
        segs.push({
          type: "L",
          x0: cur[0],
          y0: cur[1],
          x1: t1x,
          y1: t1y,
        });
        segs.push({
          type: "Q",
          x0: t1x,
          y0: t1y,
          cx: b[0],
          cy: b[1],
          x1: t2x,
          y1: t2y,
        });
        cur = [t2x, t2y];
      }
      segs.push({
        type: "L",
        x0: cur[0],
        y0: cur[1],
        x1: pts[pts.length - 1][0],
        y1: pts[pts.length - 1][1],
      });

      let total = 0;
      segs.forEach((s) => {
        total +=
          s.type === "L"
            ? Math.hypot(s.x1 - s.x0, s.y1 - s.y0)
            : Math.hypot(s.cx - s.x0, s.cy - s.y0) +
              Math.hypot(s.x1 - s.cx, s.y1 - s.cy);
      });
      if (!total) return res;

      segs.forEach((s) => {
        const sl =
          s.type === "L"
            ? Math.hypot(s.x1 - s.x0, s.y1 - s.y0)
            : Math.hypot(s.cx - s.x0, s.cy - s.y0) +
              Math.hypot(s.x1 - s.cx, s.y1 - s.cy);
        const steps = Math.max(2, Math.round((sl / total) * n));
        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          res.push(
            s.type === "L"
              ? [s.x0 + (s.x1 - s.x0) * t, s.y0 + (s.y1 - s.y0) * t]
              : [
                  (1 - t) ** 2 * s.x0 + 2 * (1 - t) * t * s.cx + t ** 2 * s.x1,
                  (1 - t) ** 2 * s.y0 + 2 * (1 - t) * t * s.cy + t ** 2 * s.y1,
                ],
          );
        }
      });
      return res;
    }

    function drawRP(
      c: CanvasRenderingContext2D,
      pts: number[][],
      r: number,
    ) {
      if (pts.length < 2) return;
      c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i - 1],
          b = pts[i],
          cc = pts[i + 1];
        const dx1 = b[0] - a[0],
          dy1 = b[1] - a[1];
        const dx2 = cc[0] - b[0],
          dy2 = cc[1] - b[1];
        const l1 = Math.hypot(dx1, dy1) || 1e-9,
          l2 = Math.hypot(dx2, dy2) || 1e-9;
        const rad = Math.min(r, l1 / 2, l2 / 2);
        c.lineTo(b[0] - (dx1 / l1) * rad, b[1] - (dy1 / l1) * rad);
        c.quadraticCurveTo(
          b[0],
          b[1],
          b[0] + (dx2 / l2) * rad,
          b[1] + (dy2 / l2) * rad,
        );
      }
      c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    }

    function drawTruck(
      c: CanvasRenderingContext2D,
      color: string,
      glowColor: string,
      alpha: number,
    ) {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.shadowColor = glowColor;
      c.shadowBlur = 10;

      c.beginPath();
      c.roundRect(-10, -2.8, 11, 5.6, 1);
      c.fill();

      c.beginPath();
      c.roundRect(1, -3.2, 6, 6.4, 1.2);
      c.fill();

      c.shadowBlur = 0;
      c.beginPath();
      c.roundRect(2.5, -4.5, 2.5, 1.2, 0.4);
      c.fill();
      c.beginPath();
      c.roundRect(2.5, 3.3, 2.5, 1.2, 0.4);
      c.fill();

      c.restore();
    }

    const FADE_OUT_START = 0.90;
    const FADE_IN_END = 0.05;
    const PAUSE = 500;

    interface AnimRoute {
      pts: number[][];
      r: number;
      dur: number;
      delay: number;
      samples: number[][];
      progress: number;
      phase: "waiting" | "travel" | "pause";
      startAt: number | null;
      pauseUntil: number | null;
      first: boolean;
    }

    let animRoutes: AnimRoute[] = [];

    function initAnimRoutes() {
      animRoutes = buildRoutes().map((r) => ({
        ...r,
        samples: samplePath(r.pts, r.r, 350),
        progress: 0,
        phase: "waiting" as const,
        startAt: null,
        pauseUntil: null,
        first: true,
      }));
    }

    function ease(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function truckAlpha(prog: number) {
      if (prog < FADE_IN_END) return prog / FADE_IN_END;
      if (prog > FADE_OUT_START)
        return 1 - (prog - FADE_OUT_START) / (1 - FADE_OUT_START);
      return 1;
    }

    function draw(ts: number) {
      ctx.clearRect(0, 0, W, H);
      const lc = cssVar("--mv-line"),
        bc = cssVar("--mv-brand"),
        gc = cssVar("--mv-glow");

      animRoutes.forEach((r) => {
        if (r.phase === "waiting") {
          if (r.startAt === null) r.startAt = ts + (r.first ? r.delay : 0);
          if (ts >= r.startAt) {
            r.phase = "travel";
            r.startAt = ts;
            r.progress = 0;
          }
        }
        if (r.phase === "travel") {
          const raw = Math.min((ts - r.startAt!) / r.dur, 1);
          r.progress = ease(raw);
          if (raw >= 1) {
            r.phase = "pause";
            r.pauseUntil = ts + PAUSE;
          }
        }
        if (r.phase === "pause") {
          r.progress = 1;
          if (ts >= r.pauseUntil!) {
            r.phase = "waiting";
            r.startAt = ts + 150;
            r.first = false;
            r.progress = 0;
          }
        }

        const prog = r.progress;
        const sc = r.samples.length;
        const hi = Math.min(Math.floor(prog * (sc - 1)), sc - 1);
        const alpha = truckAlpha(prog);

        ctx.save();
        ctx.beginPath();
        drawRP(ctx, r.pts, r.r);
        ctx.strokeStyle = lc;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.restore();

        if (prog <= 0 || sc < 2) return;

        const trail = r.samples.slice(0, hi + 1);
        if (trail.length >= 2) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(trail[0][0], trail[0][1]);
          for (let i = 1; i < trail.length; i++)
            ctx.lineTo(trail[i][0], trail[i][1]);
          ctx.strokeStyle = bc;
          ctx.lineWidth = 1.8;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.shadowColor = gc;
          ctx.shadowBlur = 7;
          ctx.globalAlpha = 0.6 * alpha;
          ctx.stroke();
          ctx.restore();
        }

        const h = r.samples[hi],
          p = r.samples[Math.max(0, hi - 2)];
        const ang = Math.atan2(h[1] - p[1], h[0] - p[0]);
        ctx.save();
        ctx.translate(h[0], h[1]);
        ctx.rotate(ang);
        drawTruck(ctx, bc, gc, alpha);
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    }

    function onResize() {
      resize();
      initAnimRoutes();
    }

    resize();
    initAnimRoutes();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="mission-vision"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Vertical divider — desktop only */}
      <div
        className="absolute left-1/2 z-[1] hidden w-px -translate-x-1/2 md:block"
        style={{
          top: "var(--section-y)",
          bottom: "var(--section-y)",
          backgroundColor: "var(--border-default)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-[1] mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-[var(--section-x)] py-[var(--section-y)] md:grid-cols-2 md:gap-20"
        style={{ alignItems: "start" }}
      >
        {/* Mission */}
        <div>
          <p
            className="mb-3.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em]"
            style={{ color: "var(--text-brand)" }}
          >
            <span
              className="block h-[2px] w-[18px] rounded-sm"
              style={{ backgroundColor: "currentColor" }}
            />
            {t("missionLabel")}
          </p>
          <h2
            className="mb-4 text-[clamp(1.35rem,2.5vw,1.85rem)] font-bold leading-[1.25]"
            style={{ color: "var(--text-heading)" }}
          >
            {t("missionHeading")}
          </h2>
          <p
            className="text-base leading-[1.8]"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("missionBody")}
          </p>
        </div>

        {/* Vision */}
        <div>
          <p
            className="mb-3.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em]"
            style={{ color: "var(--text-brand)" }}
          >
            <span
              className="block h-[2px] w-[18px] rounded-sm"
              style={{ backgroundColor: "currentColor" }}
            />
            {t("visionLabel")}
          </p>
          <h2
            className="mb-4 text-[clamp(1.35rem,2.5vw,1.85rem)] font-bold leading-[1.25]"
            style={{ color: "var(--text-heading)" }}
          >
            {t("visionHeading")}
          </h2>
          <p
            className="text-base leading-[1.8]"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("visionBody")}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

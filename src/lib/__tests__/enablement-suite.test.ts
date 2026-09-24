import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  POSTER_THEMES,
  POSTER_DIMENSIONS,
  generateMedicalTravelPoster,
  PosterThemeId,
  PosterFormat,
} from "../poster-generator";

describe("Agent Enablement & Poster Suite", () => {
  it("defines all 4 official international poster themes", () => {
    const requiredThemes: PosterThemeId[] = [
      "b2b_partner",
      "premier_hospitals",
      "cutting_edge_oncology",
      "second_opinion",
    ];

    for (const themeId of requiredThemes) {
      const theme = POSTER_THEMES[themeId];
      expect(theme).toBeDefined();
      expect(theme.headline).toBeTruthy();
      expect(theme.subheadline).toBeTruthy();
      expect(theme.pillars.length).toBeGreaterThanOrEqual(4);
      expect(theme.ctaTitle).toBeTruthy();
    }
  });

  it("verifies absolute ban on '海外华人' across all poster themes", () => {
    for (const [key, theme] of Object.entries(POSTER_THEMES)) {
      const allText = JSON.stringify(theme);
      expect(allText).not.toContain("海外华人");
      expect(allText).not.toContain("华人健康");
    }
  });

  it("defines all 3 standard aspect ratios for social & print distribution", () => {
    const formats: PosterFormat[] = ["story", "square", "flyer"];

    for (const f of formats) {
      const dim = POSTER_DIMENSIONS[f];
      expect(dim).toBeDefined();
      expect(dim.width).toBeGreaterThan(0);
      expect(dim.height).toBeGreaterThan(0);
    }

    expect(POSTER_DIMENSIONS.story.width).toBe(1080);
    expect(POSTER_DIMENSIONS.story.height).toBe(1920);

    expect(POSTER_DIMENSIONS.square.width).toBe(1080);
    expect(POSTER_DIMENSIONS.square.height).toBe(1080);

    expect(POSTER_DIMENSIONS.flyer.width).toBe(1200);
    expect(POSTER_DIMENSIONS.flyer.height).toBe(1600);
  });

  it("synthesizes valid PNG data URL with embedded QR code and invite code", async () => {
    // Mock HTMLCanvasElement
    const mockCtx = {
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      font: "",
      textAlign: "left",
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      arcTo: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      drawImage: vi.fn(),
      scale: vi.fn(),
      setTransform: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      measureText: vi.fn((text: string) => ({ width: text.length * 10 })),
    };

    const mockCanvas = {
      width: 1080,
      height: 1920,
      getContext: vi.fn(() => mockCtx),
      toDataURL: vi.fn(() => "data:image/png;base64,mockImageDataString"),
    };

    // Provide global document mock if running under Node environment
    const prevDocument = (global as any).document;
    (global as any).document = {
      createElement: vi.fn((tagName: string) => {
        if (tagName === "canvas") {
          return mockCanvas as any;
        }
        return {} as any;
      }),
    };

    const qrCanvas = mockCanvas as any;

    const result = await generateMedicalTravelPoster({
      qrCanvas,
      code: "VIP-AGENT-99",
      themeId: "b2b_partner",
      format: "story",
    });

    expect(result).toBe("data:image/png;base64,mockImageDataString");
    expect(mockCtx.fillRect).toHaveBeenCalled();
    expect(mockCtx.fillText).toHaveBeenCalled();
    expect(mockCtx.drawImage).toHaveBeenCalled();

    (global as any).document = prevDocument;
    vi.restoreAllMocks();
  });
});

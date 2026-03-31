"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import * as d3 from "d3";
import * as topojson from "topojson-client";

/* ─── constants ─── */

const MACEDONIA: [number, number] = [21.745, 41.608];

const ISO_MAP: Record<string, string> = {
  France: "fr", Germany: "de", Italy: "it", Spain: "es", Turkey: "tr",
  Bulgaria: "bg", Greece: "gr", Ukraine: "ua", Estonia: "ee", Latvia: "lv",
  Lithuania: "lt", Poland: "pl", Portugal: "pt", Romania: "ro", Serbia: "rs",
  Albania: "al", Sweden: "se", Denmark: "dk", Austria: "at", Switzerland: "ch",
  Netherlands: "nl", Belgium: "be", Czechia: "cz", Hungary: "hu", Slovakia: "sk",
  "United Kingdom": "gb", Norway: "no", Finland: "fi", "North Macedonia": "mk",
  Ireland: "ie", Moldova: "md", Belarus: "by", Croatia: "hr", Slovenia: "si",
  Montenegro: "me", Kosovo: "xk", "Bosnia and Herz.": "ba",
};

const TARGETS: { n: string; c: [number, number] }[] = [
  { n: "France", c: [2.2, 46.2] }, { n: "Germany", c: [10.4, 51.1] },
  { n: "Italy", c: [12.5, 41.8] }, { n: "Spain", c: [-3.7, 40.4] },
  { n: "Turkey", c: [35.2, 38.9] }, { n: "Bulgaria", c: [25.4, 42.7] },
  { n: "Greece", c: [22.9, 39.0] }, { n: "Ukraine", c: [31.1, 48.3] },
  { n: "Estonia", c: [25.0, 58.5] }, { n: "Latvia", c: [24.6, 56.8] },
  { n: "Lithuania", c: [23.8, 55.1] }, { n: "Poland", c: [19.1, 51.9] },
  { n: "Portugal", c: [-8.2, 39.3] }, { n: "Romania", c: [24.9, 45.9] },
  { n: "Serbia", c: [20.9, 44.0] }, { n: "Albania", c: [20.1, 41.1] },
  { n: "Sweden", c: [18.1, 59.3] }, { n: "Denmark", c: [9.5, 56.2] },
  { n: "Austria", c: [14.5, 47.5] }, { n: "Switzerland", c: [8.2, 46.8] },
  { n: "Netherlands", c: [5.2, 52.1] }, { n: "Belgium", c: [4.4, 50.5] },
  { n: "Czechia", c: [15.4, 49.8] }, { n: "Hungary", c: [19.5, 47.1] },
  { n: "Slovakia", c: [19.6, 48.6] },
];

const MAP_STYLES = `
#ms-map{width:100%;height:100vh;position:relative}
@media(max-width:1024px){#ms-map{height:75vh}}
@media(max-width:768px){#ms-map{height:60vh}}
#ms-map svg{width:100%;height:100%;cursor:grab;outline:none}
#ms-map svg:active{cursor:grabbing}
#ms-map .country{fill:#112240;stroke:#1e3a6a;stroke-width:.3px;transition:fill .3s ease}
#ms-map .flag-overlay{pointer-events:none;opacity:0;transition:opacity .4s ease}
#ms-map .country-group:hover .flag-overlay{opacity:.25}
#ms-map .arc{fill:none;stroke:#4a6fa5;stroke-width:.6px;opacity:.25;pointer-events:none}
#ms-map .particle{fill:#4a6fa5;filter:drop-shadow(0 0 2px #4a6fa5);pointer-events:none}
#ms-map .hub-point{fill:#ff4d4d;stroke:none;animation:ms-breathe 2.5s ease-in-out infinite}
#ms-map .hub-pulse{fill:#ff4d4d;stroke:none;animation:ms-pulse 2.5s cubic-bezier(.215,.61,.355,1) infinite}
@keyframes ms-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}
@keyframes ms-pulse{0%{transform:scale(.5);opacity:.6}80%,100%{transform:scale(3.5);opacity:0}}
#ms-map .ms-controls{position:absolute;top:30px;left:30px;z-index:10;background:rgba(10,25,47,.75);border:1px solid #233554;padding:12px;border-radius:4px;display:flex;flex-direction:column;gap:8px;backdrop-filter:blur(10px)}
#ms-map .ms-controls button{background:transparent;border:1px solid #233554;color:#ccd6f6;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;transition:.2s;text-transform:uppercase;letter-spacing:.05em}
#ms-map .ms-controls button:hover{background:#112240;color:#fff;border-color:#4a6fa5}
#ms-map .ms-tooltip{position:absolute;background:#020c1b;color:#fff;padding:6px 12px;border-radius:4px;font-size:11px;font-weight:600;opacity:0;border:1px solid #233554;pointer-events:none;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}
`;

/* ─── component ─── */

export function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const zoomByRef = useRef<(f: number) => void>(() => {});
  const resetViewRef = useRef<() => void>(() => {});
  const t = useTranslations("map");

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    const tooltipEl = tooltipRef.current;
    if (!container || !svgEl || !tooltipEl) return;

    if (svgEl.querySelector("g")) return;

    let mounted = true;

    const svg = d3.select<SVGSVGElement, unknown>(svgEl);
    const tooltip = d3.select(tooltipEl);
    const g = svg.append("g");
    const defs = svg.append("defs");

    const initW = container.clientWidth;
    const initH = container.clientHeight;

    const projection = d3.geoMercator()
      .center([15, 52])
      .scale(900)
      .translate([initW / 2, initH / 2]);
    const pathGen = d3.geoPath().projection(projection);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 15])
      .on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom).on("wheel.zoom", null);

    function zoomBy(factor: number) {
      svg.transition().duration(500).call(zoom.scaleBy, factor);
    }

    function resetView(animate = true) {
      const h = projection(MACEDONIA)!;
      const w = container!.clientWidth;
      const ht = container!.clientHeight;
      const t = d3.zoomIdentity
        .translate(w / 2 - h[0] * 3, ht / 2 - h[1] * 3)
        .scale(3);
      if (animate) {
        svg.transition().duration(1000).call(zoom.transform, t);
      } else {
        svg.call(zoom.transform, t);
      }
    }

    zoomByRef.current = zoomBy;
    resetViewRef.current = () => resetView(true);

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!mounted) return;
        const w = container!.clientWidth;
        const ht = container!.clientHeight;
        svg.attr("width", w).attr("height", ht);
        resetView(false);
      }, 150);
    }
    window.addEventListener("resize", onResize);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then((topology: any) => {
      if (!mounted) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countries = topojson.feature(topology, topology.objects.countries) as any;

      const countryGroups = g
        .selectAll(".country-group")
        .data(countries.features)
        .enter()
        .append("g")
        .attr("class", "country-group");

      countryGroups
        .append("path")
        .attr("class", "country")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("d", pathGen as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on("mouseover", (_e: MouseEvent, d: any) => {
          tooltip.style("opacity", "1").text(d.properties.name);
        })
        .on("mousemove", (e: MouseEvent) => {
          const rect = container!.getBoundingClientRect();
          tooltip
            .style("left", e.clientX - rect.left + 15 + "px")
            .style("top", e.clientY - rect.top - 20 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", "0");
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      countryGroups.each(function (d: any) {
        const iso = ISO_MAP[d.properties.name];
        if (!iso) return;
        const group = d3.select(this);

        let targetGeom = d.geometry;
        if (targetGeom && targetGeom.type === "MultiPolygon") {
          let maxArea = -1;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let mainPoly: any = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          targetGeom.coordinates.forEach((coords: any) => {
            const poly = { type: "Polygon" as const, coordinates: coords };
            const area = d3.geoArea({
              type: "Feature" as const,
              geometry: poly,
              properties: {},
            });
            if (area > maxArea) {
              maxArea = area;
              mainPoly = poly;
            }
          });
          if (mainPoly) targetGeom = mainPoly;
        }

        const bounds = pathGen.bounds({
          type: "Feature" as const,
          geometry: targetGeom,
          properties: {},
        });
        const bx = bounds[0][0],
          by = bounds[0][1];
        const bw = bounds[1][0] - bx,
          bh = bounds[1][1] - by;
        const clipId = `clip-${iso}-${Math.floor(Math.random() * 100000)}`;

        defs
          .append("clipPath")
          .attr("id", clipId)
          .append("path")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr("d", pathGen(d as any) || "");

        group
          .append("image")
          .attr("class", "flag-overlay")
          .attr("href", `https://flagcdn.com/w640/${iso}.png`)
          .attr("x", bx)
          .attr("y", by)
          .attr("width", bw)
          .attr("height", bh)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("clip-path", `url(#${clipId})`);
      });

      const start = projection(MACEDONIA)!;

      TARGETS.forEach((target, i) => {
        const end = projection(target.c)!;
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.4;

        const route = g
          .append("path")
          .attr("class", "arc")
          .attr(
            "d",
            `M${start[0]},${start[1]}A${dr},${dr} 0 0,1 ${end[0]},${end[1]}`,
          );

        const dot = g.append("circle").attr("r", 1.2).attr("class", "particle");
        const pathLength = (route.node() as SVGPathElement).getTotalLength();

        (function animateDot() {
          if (!mounted) return;
          dot
            .transition()
            .duration(4000 + Math.random() * 2000)
            .delay(i * 150)
            .ease(d3.easeQuadInOut)
            .attrTween("transform", () => (p: number) => {
              const pt = (route.node() as SVGPathElement).getPointAtLength(
                p * pathLength,
              );
              return `translate(${pt.x},${pt.y})`;
            })
            .on("end", animateDot);
        })();
      });

      const hqGroup = g
        .append("g")
        .attr("transform", `translate(${start[0]},${start[1]})`);
      hqGroup
        .append("circle")
        .attr("class", "hub-pulse")
        .attr("r", 8)
        .attr("cx", 0)
        .attr("cy", 0);
      hqGroup
        .append("circle")
        .attr("class", "hub-point")
        .attr("r", 4)
        .attr("cx", 0)
        .attr("cy", 0);

      resetView(true);
    });

    return () => {
      mounted = false;
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      svg.selectAll("*").interrupt();
      while (svgEl.firstChild) {
        svgEl.removeChild(svgEl.firstChild);
      }
    };
  }, []);

  return (
    <section id="map" style={{ backgroundColor: "#020c1b", width: "100%" }}>
      <style dangerouslySetInnerHTML={{ __html: MAP_STYLES }} />
      <div id="ms-map" ref={containerRef}>
        <div ref={tooltipRef} className="ms-tooltip" />
        <div className="ms-controls">
          <button type="button" onClick={() => zoomByRef.current(1.5)}>
            {t("zoomIn")}
          </button>
          <button type="button" onClick={() => zoomByRef.current(0.75)}>
            {t("zoomOut")}
          </button>
          <button type="button" onClick={() => resetViewRef.current()}>
            {t("reset")}
          </button>
        </div>
        <svg ref={svgRef} />
      </div>
    </section>
  );
}

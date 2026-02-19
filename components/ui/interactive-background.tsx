"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type p5Types from "p5";

class Particle {
  pos: p5Types.Vector;
  vel: p5Types.Vector;
  size: number;
  p: p5Types;

  constructor(p: p5Types) {
    this.p = p;
    this.pos = p.createVector(p.random(p.width), p.random(p.height));
    this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
    this.size = p.random(2, 4);
  }

  move(mouseDistance: number) {
    this.pos.add(this.vel);

    // Check edges
    if (this.pos.x < 0 || this.pos.x > this.p.width) {
      this.vel.x *= -1;
      if (this.pos.x < 0) this.pos.x = 0;
      if (this.pos.x > this.p.width) this.pos.x = this.p.width;
    }
    if (this.pos.y < 0 || this.pos.y > this.p.height) {
      this.vel.y *= -1;
      if (this.pos.y < 0) this.pos.y = 0;
      if (this.pos.y > this.p.height) this.pos.y = this.p.height;
    }

    // Mouse interaction
    const d = this.p.dist(this.pos.x, this.pos.y, this.p.mouseX, this.p.mouseY);
    if (d < mouseDistance) {
      const repulsion = this.p.createVector(this.pos.x - this.p.mouseX, this.pos.y - this.p.mouseY);
      repulsion.normalize();
      repulsion.mult(0.05);
      this.vel.add(repulsion);
    }
    this.vel.limit(2);
  }

  display(color: p5Types.Color) {
    this.p.noStroke();
    this.p.fill(color);
    this.p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

const InteractiveBackground = () => {
  const { theme, systemTheme } = useTheme();
  const renderRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5Types | null>(null);

  useEffect(() => {
    let p5Module: typeof import("p5");
    let isMounted = true;

    const initP5 = async () => {
      try {
        p5Module = await import("p5");
        const P5 = p5Module.default;

        const sketch = (p: p5Types) => {
          const particles: Particle[] = [];
          const particleCount = 80;
          const connectionDistance = 120;
          const mouseDistance = 150;
          
          let particleColor: p5Types.Color;
          let lineColor: p5Types.Color;
          let mouseLineColor: p5Types.Color;
          let packetColor: p5Types.Color;

          const updateColors = () => {
            const currentTheme = theme === "system" ? systemTheme : theme;
            const isDark = currentTheme === "dark";
          
            if (isDark) {
              particleColor = p.color(200, 255, 255, 150); 
              lineColor = p.color(64, 224, 208); 
              mouseLineColor = p.color(255, 255, 255);
              packetColor = p.color(255, 200, 50, 200);
            } else {
              particleColor = p.color(30, 60, 90, 150); 
              lineColor = p.color(100, 120, 140); 
              mouseLineColor = p.color(50, 50, 50);
              packetColor = p.color(255, 140, 0, 200);
            }
          };

          p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            
            for (let i = 0; i < particleCount; i++) {
              particles.push(new Particle(p));
            }
            
            updateColors();
          };

          p.draw = () => {
            p.clear(); 
            
            for (let i = 0; i < particles.length; i++) {
              particles[i].move(mouseDistance);
              particles[i].display(particleColor);
            }
            
            connectParticles();
          };

          const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
             
              for (let j = i + 1; j < particles.length; j++) {
                const d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
                if (d < connectionDistance) {
                  const alpha = p.map(d, 0, connectionDistance, 150, 0);
                  const c = p.color(p.red(lineColor), p.green(lineColor), p.blue(lineColor), alpha);
                  p.stroke(c);
                  p.strokeWeight(1);
                  p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
                }
              }
              
              
              const dMouse = p.dist(particles[i].pos.x, particles[i].pos.y, p.mouseX, p.mouseY);
              if (dMouse < mouseDistance) {
                 
                  const alpha = p.map(dMouse, 0, mouseDistance, 150, 0);
                  const c = p.color(p.red(mouseLineColor), p.green(mouseLineColor), p.blue(mouseLineColor), alpha);
                  p.stroke(c);
                  p.strokeWeight(1);
                  p.line(particles[i].pos.x, particles[i].pos.y, p.mouseX, p.mouseY);

                 
                  const transferSpeed = 0.02; 
                  const t = (p.frameCount * transferSpeed + i * 0.1) % 1.0; 
                  
                  const tx = p.lerp(particles[i].pos.x, p.mouseX, t);
                  const ty = p.lerp(particles[i].pos.y, p.mouseY, t);
                  
                  p.noStroke();
                  p.fill(packetColor); 
                  p.ellipse(tx, ty, 4, 4); 
              }
            }
          };

          p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
          };
        };

        if (renderRef.current && isMounted) {
            
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove();
            }
            
            p5InstanceRef.current = new P5(sketch, renderRef.current);
        }

      } catch (error) {
        console.error("Error loading p5", error);
      }
    };

    initP5();

    return () => {
      isMounted = false;
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [theme, systemTheme]);

  return <div ref={renderRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-linear-to-br from-background to-muted" />;
};

export default InteractiveBackground;

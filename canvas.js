(function () {
    const canvas = document.getElementById('bgCanvas');
    const ctx    = canvas.getContext('2d');
    let tick = 0;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // ── 7-segment digit ──────────────────────────────────────────────────────
    const SEG = [
        [1,1,1,1,1,1,0], // 0
        [0,1,1,0,0,0,0], // 1
        [1,1,0,1,1,0,1], // 2
        [1,1,1,1,0,0,1], // 3
        [0,1,1,0,0,1,1], // 4
        [1,0,1,1,0,1,1], // 5
        [1,0,1,1,1,1,1], // 6
        [1,1,1,0,0,0,0], // 7
        [1,1,1,1,1,1,1], // 8
        [1,1,1,1,0,1,1], // 9
    ];

    function drawSegDigit(ctx, x, y, w, h, digit, onColor, offColor) {
        const t  = h * 0.09;
        const g  = h * 0.04;
        const s  = SEG[digit];

        function seg(on, x1,y1,x2,y2,x3,y3,x4,y4) {
            ctx.beginPath();
            ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
            ctx.lineTo(x3,y3); ctx.lineTo(x4,y4);
            ctx.closePath();
            ctx.fillStyle = on ? onColor : offColor;
            ctx.fill();
        }
        // top
        seg(s[0], x+g+t,y+g, x+w-g-t,y+g, x+w-g-t*.5,y+g+t, x+g+t*.5,y+g+t);
        // top-right
        seg(s[1], x+w-g,y+g+t, x+w-g-t,y+g+t*.5, x+w-g-t,y+h/2-g, x+w-g,y+h/2-g);
        // bottom-right
        seg(s[2], x+w-g,y+h/2+g, x+w-g-t,y+h/2+g, x+w-g-t,y+h-g-t*.5, x+w-g,y+h-g-t);
        // bottom
        seg(s[3], x+g+t*.5,y+h-g-t, x+w-g-t*.5,y+h-g-t, x+w-g-t,y+h-g, x+g+t,y+h-g);
        // bottom-left
        seg(s[4], x+g,y+h/2+g, x+g+t,y+h/2+g, x+g+t,y+h-g-t*.5, x+g,y+h-g-t);
        // top-left
        seg(s[5], x+g,y+g+t, x+g+t,y+g+t*.5, x+g+t,y+h/2-g, x+g,y+h/2-g);
        // middle
        seg(s[6], x+g+t*.5,y+h/2-t/2, x+w-g-t*.5,y+h/2-t/2, x+w-g-t,y+h/2+t/2, x+g+t,y+h/2+t/2);
    }

    // ── LCD 7-segment odometer (compact amber, ODO label left) ──────────────
    function drawOdometer(ctx, cx, cy, R, kmValue) {
        const str  = kmValue.toString();
        const n    = str.length;
        const dh   = R * 0.13;
        const dw   = dh * 0.72;
        const pad  = dh * 0.18;
        const odoLW = dh * 0.9;
        const boxW  = odoLW + dw * n + pad * 2;
        const boxH  = dh + pad * 2;
        const ox    = cx - boxW / 2;
        const oy    = cy + R * 0.38;

        // Amber LCD background
        const lcdG = ctx.createLinearGradient(ox, oy, ox, oy+boxH);
        lcdG.addColorStop(0,    'rgba(195,155,40,1)');
        lcdG.addColorStop(0.35, 'rgba(215,175,55,1)');
        lcdG.addColorStop(1,    'rgba(170,130,25,1)');
        ctx.fillStyle = lcdG;
        ctx.beginPath();
        ctx.roundRect(ox-3, oy-3, boxW+6, boxH+6, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(100,75,10,0.85)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(160,120,15,0.4)';
        ctx.fillRect(ox, oy, boxW, boxH);

        for (let sy = oy; sy < oy+boxH; sy += 2) {
            ctx.fillStyle = 'rgba(0,0,0,0.07)';
            ctx.fillRect(ox, sy, boxW, 1);
        }

        // ODO label left
        ctx.font = `bold ${dh*0.38}px Arial`;
        ctx.fillStyle = 'rgba(80,50,5,0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ODO', ox + odoLW/2, oy + boxH/2 - dh*0.1);
        ctx.font = `${dh*0.30}px Arial`;
        ctx.fillText('km', ox + odoLW/2, oy + boxH/2 + dh*0.28);

        // Divider
        ctx.strokeStyle = 'rgba(80,50,5,0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(ox+odoLW, oy+pad*0.5);
        ctx.lineTo(ox+odoLW, oy+boxH-pad*0.5);
        ctx.stroke();

        const digX  = ox + odoLW + pad*0.5;
        const digY  = oy + pad;
        const onC   = 'rgba(60,35,5,0.95)';
        const offC  = 'rgba(160,120,15,0.30)';

        for (let i = 0; i < n; i++)
            drawSegDigit(ctx, digX + i*dw, digY, dw*0.88, dh, 8, offC, offC);
        for (let i = 0; i < n; i++)
            drawSegDigit(ctx, digX + i*dw, digY, dw*0.88, dh, parseInt(str[i]), onC, offC);
    }

    // ── Rolling mechanical odometer ──────────────────────────────────────────
    function drawRollingOdo(ctx, cx, cy, R, kmValue, rollOffset) {
        const ow  = R * 0.95;
        const oh  = R * 0.14;
        const ox  = cx - ow / 2;
        const oy  = cy + R * 0.35;
        const str = kmValue.toString();
        const n   = str.length;
        const dw  = ow / n;

        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.roundRect(ox-5, oy-5, ow+10, oh+10, 5);
        ctx.fill();
        ctx.strokeStyle = 'rgba(100,100,100,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        for (let i = 0; i < n; i++) {
            const digit = parseInt(str[i]);
            const roll  = i === n-1 ? rollOffset : i === n-2 ? rollOffset*0.1 : 0;

            ctx.save();
            ctx.beginPath();
            ctx.rect(ox+i*dw, oy, dw, oh);
            ctx.clip();

            ctx.fillStyle = i < n-1 ? 'rgba(228,220,200,1)' : 'rgba(255,195,175,1)';
            ctx.fillRect(ox+i*dw, oy, dw, oh);

            for (let d = -1; d <= 1; d++) {
                const sd    = ((digit+d)%10+10)%10;
                const dy    = oy + d*oh - roll*oh;
                const alpha = Math.max(0, 1 - Math.abs(d-roll)*1.3);
                ctx.font         = `bold ${oh*0.76}px Arial`;
                ctx.fillStyle    = `rgba(5,5,5,${alpha})`;
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(sd, ox+i*dw+dw/2, dy+oh/2);
            }

            const ts = ctx.createLinearGradient(0, oy, 0, oy+oh*0.38);
            ts.addColorStop(0, 'rgba(0,0,0,0.72)'); ts.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = ts; ctx.fillRect(ox+i*dw, oy, dw, oh);

            const bs = ctx.createLinearGradient(0, oy+oh*0.62, 0, oy+oh);
            bs.addColorStop(0, 'rgba(0,0,0,0)'); bs.addColorStop(1, 'rgba(0,0,0,0.72)');
            ctx.fillStyle = bs; ctx.fillRect(ox+i*dw, oy, dw, oh);

            ctx.restore();

            if (i > 0) {
                ctx.strokeStyle = 'rgba(60,60,60,1)';
                ctx.lineWidth   = 1;
                ctx.beginPath();
                ctx.moveTo(ox+i*dw, oy); ctx.lineTo(ox+i*dw, oy+oh);
                ctx.stroke();
            }
        }

        ctx.font         = `${R*0.065}px Arial`;
        ctx.fillStyle    = 'rgba(160,160,160,0.5)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ODO  km', cx, oy+oh+R*0.078);
    }

    // ── Speedometer face ─────────────────────────────────────────────────────
    function drawFace(ctx, cx, cy, R) {
        // Bezel
        const bezel = ctx.createRadialGradient(cx, cy, R*0.84, cx, cy, R);
        bezel.addColorStop(0,   'rgba(55,55,55,0.97)');
        bezel.addColorStop(0.5, 'rgba(26,26,26,0.98)');
        bezel.addColorStop(1,   'rgba(72,72,72,0.95)');
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI*2);
        ctx.fillStyle = bezel; ctx.fill();

        // Face
        const face = ctx.createRadialGradient(cx, cy-R*0.12, R*0.04, cx, cy, R*0.87);
        face.addColorStop(0,   'rgba(36,36,36,1)');
        face.addColorStop(0.5, 'rgba(11,11,11,1)');
        face.addColorStop(1,   'rgba(4,4,4,1)');
        ctx.beginPath();
        ctx.arc(cx, cy, R*0.87, 0, Math.PI*2);
        ctx.fillStyle = face; ctx.fill();

        const startA = Math.PI * 0.75;
        const endA   = Math.PI * 2.25;

        // ── Inner MPH scale ──
        for (let i = 0; i <= 28; i++) { // 0-140 mph, step 5
            const a     = startA + (endA-startA)*(i/28);
            const oR    = R * 0.65;
            const isMaj = i % 4 === 0;
            const iR    = oR - (isMaj ? R*0.07 : R*0.035);
            ctx.beginPath();
            ctx.moveTo(cx+Math.cos(a)*oR, cy+Math.sin(a)*oR);
            ctx.lineTo(cx+Math.cos(a)*iR, cy+Math.sin(a)*iR);
            ctx.strokeStyle = isMaj ? 'rgba(255,175,40,0.55)' : 'rgba(255,175,40,0.22)';
            ctx.lineWidth   = isMaj ? 1.5 : 0.8;
            ctx.stroke();
            if (isMaj) {
                const mph = Math.round((i/28)*140);
                const lr  = iR - R*0.07;
                ctx.font         = `${R*0.052}px Arial`;
                ctx.fillStyle    = 'rgba(255,175,40,0.52)';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(mph, cx+Math.cos(a)*lr, cy+Math.sin(a)*lr);
            }
        }
        ctx.font         = `bold ${R*0.052}px Arial`;
        ctx.fillStyle    = 'rgba(255,175,40,0.42)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MPH', cx, cy - R*0.30);

        // ── Outer km/h scale ──
        for (let i = 0; i <= 44; i++) { // 0-220 km/h
            const a     = startA + (endA-startA)*(i/44);
            const isMaj = i % 4 === 0;
            const isMed = i % 2 === 0;
            const oR    = R * 0.80;
            const iR    = oR - (isMaj ? R*0.13 : isMed ? R*0.07 : R*0.04);
            ctx.beginPath();
            ctx.moveTo(cx+Math.cos(a)*oR, cy+Math.sin(a)*oR);
            ctx.lineTo(cx+Math.cos(a)*iR, cy+Math.sin(a)*iR);
            ctx.strokeStyle = isMaj ? 'rgba(255,255,255,0.92)' : isMed ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)';
            ctx.lineWidth   = isMaj ? 2.5 : 1;
            ctx.stroke();
            if (isMaj) {
                const spd = Math.round((i/44)*220);
                const lr  = iR - R*0.10;
                ctx.font         = `bold ${R*0.088}px Arial`;
                ctx.fillStyle    = 'rgba(255,255,255,0.88)';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(spd, cx+Math.cos(a)*lr, cy+Math.sin(a)*lr);
            }
        }
        ctx.font         = `bold ${R*0.088}px Arial`;
        ctx.fillStyle    = 'rgba(255,255,255,0.42)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('km/h', cx, cy - R*0.16);
    }

    // ── Needle ───────────────────────────────────────────────────────────────
    function drawNeedle(ctx, cx, cy, R) {
        const startA = Math.PI * 0.75;
        const endA   = Math.PI * 2.25;
        const a      = startA - (endA-startA) * 0.018; // rests just below 0 mark

        ctx.save();
        ctx.shadowColor = 'rgba(255,55,0,0.8)';
        ctx.shadowBlur  = 14;
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(a)*R*0.08, cy - Math.sin(a)*R*0.08);
        ctx.lineTo(cx + Math.cos(a)*R*0.73,  cy + Math.sin(a)*R*0.73);
        ctx.strokeStyle = 'rgba(255,45,0,1)';
        ctx.lineWidth   = R * 0.020;
        ctx.lineCap     = 'round';
        ctx.stroke();
        ctx.restore();

        // Pivot
        ctx.beginPath();
        ctx.arc(cx, cy, R*0.062, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(32,32,32,1)'; ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, R*0.028, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,65,0,1)'; ctx.fill();
    }

    // ── Main loop ────────────────────────────────────────────────────────────
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        tick += 0.006;
        const rollOffset = (tick * 0.25) % 1;

        const R = Math.min(w * 0.18, h * 0.28, 175);

        // Left: analog + rolling mechanical odo
        const lx = R * 0.68, ly = R * 0.68;
        drawFace(ctx, lx, ly, R);
        drawRollingOdo(ctx, lx, ly, R, 15800, rollOffset);
        drawNeedle(ctx, lx, ly, R);

        // Right: analog + 7-segment LCD odo
        const rx = w - R * 0.68, ry = h - R * 0.68;
        drawFace(ctx, rx, ry, R);
        drawOdometer(ctx, rx, ry, R, 15800);
        drawNeedle(ctx, rx, ry, R);

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
})();

(function() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let tick = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function drawSpeedometerFace(ctx, cx, cy, R, accentColor, maxSpeed) {
        const startA = Math.PI * 0.75;
        const endA   = Math.PI * 2.25;
        const bezel = ctx.createRadialGradient(cx, cy, R*0.88, cx, cy, R);
        bezel.addColorStop(0,  'rgba(60,60,60,0.95)');
        bezel.addColorStop(0.5,'rgba(30,30,30,0.98)');
        bezel.addColorStop(1,  'rgba(80,80,80,0.95)');
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI*2);
        ctx.fillStyle = bezel;
        ctx.fill();
        const face = ctx.createRadialGradient(cx, cy-R*0.2, R*0.1, cx, cy, R*0.9);
        face.addColorStop(0,  'rgba(40,40,40,1)');
        face.addColorStop(0.6,'rgba(15,15,15,1)');
        face.addColorStop(1,  'rgba(5,5,5,1)');
        ctx.beginPath();
        ctx.arc(cx, cy, R*0.9, 0, Math.PI*2);
        ctx.fillStyle = face;
        ctx.fill();
        for (let i = 0; i <= 44; i++) {
            const a = startA + (endA-startA)*(i/44);
            const isMaj = i%4===0, isMed = i%2===0;
            const oR = R*0.80;
            const iR = oR - (isMaj ? R*0.13 : isMed ? R*0.07 : R*0.04);
            ctx.beginPath();
            ctx.moveTo(cx+Math.cos(a)*oR, cy+Math.sin(a)*oR);
            ctx.lineTo(cx+Math.cos(a)*iR, cy+Math.sin(a)*iR);
            ctx.strokeStyle = isMaj ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)';
            ctx.lineWidth = isMaj ? 2.5 : 1;
            ctx.stroke();
            if (isMaj) {
                const spd = Math.round((i/44)*maxSpeed);
                const lr  = iR - R*0.1;
                ctx.font = `bold ${R*0.088}px Arial`;
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(spd, cx+Math.cos(a)*lr, cy+Math.sin(a)*lr);
            }
        }
        ctx.font = `bold ${R*0.09}px Arial`;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('km/h', cx, cy - R*0.22);
    }

    function drawNeedle(ctx, cx, cy, R, r, g, b) {
        const startA = Math.PI*0.75, endA = Math.PI*2.25;
        const a = startA + (endA-startA)*0.02;
        ctx.save();
        ctx.shadowColor = `rgba(${r},${g},${b},0.7)`;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(cx-Math.cos(a)*R*0.12, cy-Math.sin(a)*R*0.12);
        ctx.lineTo(cx+Math.cos(a)*R*0.73, cy+Math.sin(a)*R*0.73);
        ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
        ctx.lineWidth = R*0.024;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
        ctx.beginPath(); ctx.arc(cx, cy, R*0.068, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(40,40,40,1)'; ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, R*0.032, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${r},${g},${b},1)`; ctx.fill();
    }

    function drawAnalogGauge(ctx, cx, cy, R, kmValue, rollOffset) {
        drawSpeedometerFace(ctx, cx, cy, R, '255,100,0', 220);
        const ow = R*1.05, oh = R*0.20;
        const ox = cx - ow/2, oy = cy + R*0.38;
        const dw = ow/6;
        ctx.fillStyle='rgba(0,0,0,1)';
        roundRect(ctx, ox-5, oy-5, ow+10, oh+10, 5); ctx.fill();
        ctx.strokeStyle='rgba(100,100,100,0.6)'; ctx.lineWidth=1.5;
        roundRect(ctx, ox-5, oy-5, ow+10, oh+10, 5); ctx.stroke();
        const kmStr = kmValue.toString().padStart(6,'0');
        for (let i=0; i<6; i++) {
            const digit = parseInt(kmStr[i]);
            const roll  = i===5 ? rollOffset : i===4 ? rollOffset*0.1 : 0;
            ctx.save();
            ctx.beginPath(); ctx.rect(ox+i*dw, oy, dw, oh); ctx.clip();
            ctx.fillStyle = i<5 ? 'rgba(235,228,210,1)' : 'rgba(255,200,180,1)';
            ctx.fillRect(ox+i*dw, oy, dw, oh);
            for (let d=-1; d<=1; d++) {
                const sd = ((digit+d)%10+10)%10;
                const dy = oy + d*oh - roll*oh;
                const alpha = Math.max(0, 1 - Math.abs(d-roll)*1.3);
                ctx.font = `bold ${oh*0.76}px Arial`;
                ctx.fillStyle = `rgba(5,5,5,${alpha})`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(sd, ox+i*dw+dw/2, dy+oh/2);
            }
            const ts = ctx.createLinearGradient(0, oy, 0, oy+oh*0.4);
            ts.addColorStop(0,'rgba(0,0,0,0.75)'); ts.addColorStop(1,'rgba(0,0,0,0)');
            ctx.fillStyle=ts; ctx.fillRect(ox+i*dw, oy, dw, oh);
            const bs = ctx.createLinearGradient(0, oy+oh*0.6, 0, oy+oh);
            bs.addColorStop(0,'rgba(0,0,0,0)'); bs.addColorStop(1,'rgba(0,0,0,0.75)');
            ctx.fillStyle=bs; ctx.fillRect(ox+i*dw, oy, dw, oh);
            ctx.restore();
            if (i>0) {
                ctx.strokeStyle='rgba(60,60,60,1)'; ctx.lineWidth=1;
                ctx.beginPath();
                ctx.moveTo(ox+i*dw, oy); ctx.lineTo(ox+i*dw, oy+oh);
                ctx.stroke();
            }
        }
        ctx.font=`${R*0.072}px Arial`;
        ctx.fillStyle='rgba(180,180,180,0.55)';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('ODO  km', cx, oy+oh+R*0.075);
        drawNeedle(ctx, cx, cy, R, 255, 100, 0);
    }

    function drawDigitalGauge(ctx, cx, cy, R, kmValue) {
        drawSpeedometerFace(ctx, cx, cy, R, '255,50,50', 220);
        const ow = R*1.05, oh = R*0.20;
        const ox = cx - ow/2, oy = cy + R*0.38;
        ctx.fillStyle='rgba(3,3,3,1)';
        roundRect(ctx, ox-5, oy-5, ow+10, oh+10, 5); ctx.fill();
        ctx.strokeStyle='rgba(70,70,70,0.7)'; ctx.lineWidth=1.5;
        roundRect(ctx, ox-5, oy-5, ow+10, oh+10, 5); ctx.stroke();
        ctx.fillStyle='rgba(6,4,0,1)';
        ctx.fillRect(ox, oy, ow, oh);
        ctx.font=`bold ${oh*0.76}px 'Courier New',monospace`;
        ctx.fillStyle='rgba(100,45,0,0.35)';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('8888888', cx-ow*0.05, oy+oh/2);
        ctx.save();
        ctx.shadowColor='rgba(255,90,0,1)';
        ctx.shadowBlur=14;
        ctx.fillStyle='rgba(255,130,0,1)';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(kmValue.toString().padStart(6,'0'), cx-ow*0.05, oy+oh/2);
        ctx.restore();
        for (let sy=oy; sy<oy+oh; sy+=2) {
            ctx.fillStyle='rgba(0,0,0,0.15)';
            ctx.fillRect(ox, sy, ow, 1);
        }
        ctx.font=`${R*0.072}px Arial`;
        ctx.fillStyle='rgba(180,180,180,0.55)';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('ODO  km', cx, oy+oh+R*0.075);
        drawNeedle(ctx, cx, cy, R, 255, 50, 50);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width, h = canvas.height;
        tick += 0.006;
        const rollOffset = (tick * 0.25) % 1;
        // Begränsa R så mätarna aldrig sticker utanför viewport
        const maxR = Math.min(w * 0.18, h * 0.28, 180);
        const R = maxR;
        drawAnalogGauge(ctx, R * 0.65, R * 0.65, R, 15800, rollOffset);
        // Klämmer cx så höger mätare alltid är fullt synlig innanför canvasen
        const rightCx = w - R * 0.65;
        const rightCy = h - R * 0.65;
        drawDigitalGauge(ctx, rightCx, rightCy, R, 15800);
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
})();

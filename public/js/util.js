class Util {
    constructor() {
    }

    getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();

        let x = evt.clientX - rect.left;
        let y = evt.clientY - rect.top;


        return new Point(x, y);
    }

    arcRandom(min, max, radius) {
        let x, y;
        while (true) {

            x = Math.floor(Math.random() * (max - min + 1)) + min;
            y = Math.floor(Math.random() * (max - min + 1)) + min;

            if (x ** 2 + y ** 2 < radius ** 2) {
                return { x, y };
            }
        }
    }

    random(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    randomColor() {
        let colors = ["#C0392B", "#E74C3C", "#9B59B6", "#8E44AD", "#2980B9",
            "#3498DB", "#17A589", "#138D75", "#229954", "#28B463", "#D4AC0D",
            "#D68910", "#CA6F1E", "#BA4A00"];
        return colors[this.random(0, colors.length - 1)];
    }

    getDistance(i, f) {
        return Math.sqrt(
            Math.pow((f.x - i.x), 2) + Math.pow((f.y - i.y), 2));
    }

    getAngle(p1, p2) {
        return ((Math.atan2(p2.y - p1.y, p2.x - p1.x)));
    }

    cirCollission(x1, y1, r1, x2, y2, r2) {
        return (this.getDistance(new Point(x1, y1),
            new Point(x2, y2)) < (r1 + r2));
    }

    rotate(p, c, angle) {
        let si = Math.sin(angle);
        let co = Math.cos(angle);

        p.x -= c.x;
        p.y -= c.y;

        let xnew = p.x * co - p.y * si;
        let ynew = p.x * si + p.y * co;

        p.x = xnew + c.x;
        p.y = ynew + c.y;

        return p;
    }


    color(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }

        lum = lum || 0;

        // convert to decimal and change luminosity
        let rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    }

}
"""Generate KIZUNA PWA icons and iOS launch images from the official app seal."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SOURCE = ASSETS / "kizuna-app-icon-512.png"
GREEN = "#142923"
CREAM = "#f7f2e8"
RED = "#861816"
GOLD = "#b89a62"


def font(size: int, serif: bool = False) -> ImageFont.FreeTypeFont:
    candidates = (
        [Path("C:/Windows/Fonts/GARA.TTF"), Path("C:/Windows/Fonts/georgia.ttf")]
        if serif
        else [Path("C:/Windows/Fonts/consola.ttf"), Path("C:/Windows/Fonts/arial.ttf")]
    )
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def seal(diameter: int) -> Image.Image:
    source = Image.open(SOURCE).convert("RGBA")
    source = source.resize((diameter, diameter), Image.Resampling.LANCZOS)
    mask = Image.new("L", (diameter, diameter), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, diameter - 1, diameter - 1), fill=255)
    source.putalpha(mask)
    return source


def app_icon(size: int, maskable: bool) -> Image.Image:
    image = Image.new("RGBA", (size, size), GREEN if maskable else (0, 0, 0, 0))
    diameter = round(size * (0.64 if maskable else 0.82))
    pos = ((size - diameter) // 2, (size - diameter) // 2)
    draw = ImageDraw.Draw(image)
    rim = max(2, round(size * 0.012))
    draw.ellipse(
        (pos[0] - rim, pos[1] - rim, pos[0] + diameter + rim, pos[1] + diameter + rim),
        fill=GOLD,
    )
    image.alpha_composite(seal(diameter), pos)
    return image


def launch_image(width: int, height: int, filename: str) -> None:
    image = Image.new("RGB", (width, height), GREEN)
    draw = ImageDraw.Draw(image)
    unit = min(width, height)

    # Fine archival frame: visible, but quiet enough to survive device cropping.
    inset = round(unit * 0.045)
    line = max(2, round(unit * 0.002))
    draw.rectangle((inset, inset, width - inset, height - inset), outline="#6f796b", width=line)
    draw.line((inset, inset * 1.45, width - inset, inset * 1.45), fill="#384b43", width=line)
    draw.line((inset, height - inset * 1.45, width - inset, height - inset * 1.45), fill="#384b43", width=line)

    diameter = round(unit * (0.43 if height >= width else 0.34))
    center_x = width // 2
    center_y = round(height * (0.44 if height >= width else 0.45))
    x = center_x - diameter // 2
    y = center_y - diameter // 2
    rim = max(3, round(unit * 0.004))
    draw.ellipse((x - rim, y - rim, x + diameter + rim, y + diameter + rim), fill=GOLD)
    image.paste(seal(diameter), (x, y), seal(diameter))

    rule_y = y + diameter + round(unit * 0.075)
    rule_half = round(unit * 0.09)
    draw.line((center_x - rule_half, rule_y, center_x + rule_half, rule_y), fill=RED, width=max(3, line))
    caption = "ARCHIVO DE EXPERIENCIAS"
    caption_font = font(max(15, round(unit * 0.023)))
    box = draw.textbbox((0, 0), caption, font=caption_font)
    draw.text(
        (center_x - (box[2] - box[0]) / 2, rule_y + round(unit * 0.035)),
        caption,
        font=caption_font,
        fill=CREAM,
    )

    image.save(ASSETS / filename, optimize=True)


def main() -> None:
    app_icon(192, False).save(ASSETS / "kizuna-app-icon-192-v2.png", optimize=True)
    app_icon(512, False).save(ASSETS / "kizuna-app-icon-512-v2.png", optimize=True)
    app_icon(512, True).convert("RGB").save(
        ASSETS / "kizuna-app-icon-maskable-512-v2.png", optimize=True
    )

    sizes = [
        (1290, 2796),  # iPhone Pro Max
        (1179, 2556),  # iPhone Pro
        (1170, 2532),  # iPhone 12/13/14
        (1284, 2778),  # iPhone 12/13/14 Pro Max
        (2048, 2732),  # iPad Pro 12.9
    ]
    for width, height in sizes:
        launch_image(width, height, f"apple-launch-{width}x{height}.png")
        launch_image(height, width, f"apple-launch-{height}x{width}.png")


if __name__ == "__main__":
    main()

import os
from PIL import Image

def convert_to_webp(input_path, output_path, max_width=None, quality=80):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return False
    
    try:
        img = Image.open(input_path)
        orig_size = os.path.getsize(input_path) / 1024
        
        # Preserve transparency channel if saving to webp
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
            
        # Resize if width exceeds max_width
        if max_width and img.size[0] > max_width:
            aspect_ratio = img.size[1] / img.size[0]
            new_height = int(max_width * aspect_ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"Resized {os.path.basename(input_path)} to {max_width}x{new_height}")
            
        # Save as WEBP
        img.save(output_path, "WEBP", quality=quality, method=6)
        
        new_size = os.path.getsize(output_path) / 1024
        reduction = (1 - (new_size / orig_size)) * 100
        print(f"Converted {os.path.basename(input_path)}: {orig_size:.1f}KB -> {new_size:.1f}KB ({reduction:.1f}% reduction)")
        return True
    except Exception as e:
        print(f"Error converting {input_path}: {e}")
        return False

# Directories
assets_dir = "/Users/punjayawickramasinghe/dev/portfolio-website/assets"

# List of images to optimize
images_to_optimize = [
    # Project images
    ("ai-change-detection.png", "ai-change-detection.webp", 800),
    ("bms.jpg", "bms.webp", 800),
    ("gps-denied-forest.jpeg", "gps-denied-forest.webp", 800),
    ("rnd_aer_square.png", "rnd_aer_square.webp", 800),
    ("rnd_cins_square.jpg", "rnd_cins_square.webp", 800),
    ("rnd_mofs_transparent.png", "rnd_mofs_transparent.webp", 800),
    ("combined-xi-builder2.png", "combined-xi-builder2.webp", 800),
    ("games-connect4-snake.jpeg", "games-connect4-snake.webp", 800),
    ("portfolio-website.jpeg", "portfolio-website.webp", 800),
    
    # Profile & About images
    ("profile-pic.png", "profile-pic.webp", 500),
    ("about-pic.png", "about-pic.webp", 600),
    
    # High-use icon
    ("icon-html-css-js.png", "icon-html-css-js.webp", 128)
]

for src_name, dest_name, max_w in images_to_optimize:
    src_path = os.path.join(assets_dir, src_name)
    dest_path = os.path.join(assets_dir, dest_name)
    convert_to_webp(src_path, dest_path, max_width=max_w)

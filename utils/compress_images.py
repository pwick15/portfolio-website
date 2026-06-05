from PIL import Image
import os

def compress_image(input_path, output_path, max_width=None, quality=85):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return False
    
    try:
        img = Image.open(input_path)
        orig_size = os.path.getsize(input_path) / (1024 * 1024)
        
        # Preserve transparency channel if PNG
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
            
        # Save compressed version
        if input_path.lower().endswith('.png'):
            # Save PNG optimized (lossless, but optimized)
            img.save(output_path, "PNG", optimize=True)
        else:
            img.save(output_path, "JPEG", quality=quality, optimize=True)
            
        new_size = os.path.getsize(output_path) / (1024 * 1024)
        reduction = (1 - (new_size / orig_size)) * 100
        print(f"Compressed {os.path.basename(input_path)}: {orig_size:.2f}MB -> {new_size:.2f}MB ({reduction:.1f}% reduction)")
        return True
    except Exception as e:
        print(f"Error compressing {input_path}: {e}")
        return False

# Directories
assets_dir = "/Users/punjayawickramasinghe/dev/portfolio-website/assets"

# 1. Profile Picture (originally 1.43 MB)
# Profile picture is displayed inside a 150px circle. 500px is more than enough for high-density displays.
compress_image(
    os.path.join(assets_dir, "profile-pic.png"),
    os.path.join(assets_dir, "profile-pic.png"),
    max_width=500
)

# 2. About Picture (originally 1.16 MB)
# Displayed at max 320px width.
compress_image(
    os.path.join(assets_dir, "about-pic.png"),
    os.path.join(assets_dir, "about-pic.png"),
    max_width=600
)

# 3. AI Change Detection (originally 1.56 MB)
compress_image(
    os.path.join(assets_dir, "ai-change-detection.png"),
    os.path.join(assets_dir, "ai-change-detection.png"),
    max_width=800
)

# 4. MOFs Transparent (originally 1.46 MB)
compress_image(
    os.path.join(assets_dir, "rnd_mofs_transparent.png"),
    os.path.join(assets_dir, "rnd_mofs_transparent.png"),
    max_width=800
)

# 5. Awards Pic (originally 4.51 MB)
# Let's compress awards-pic.png to a smaller web-friendly PNG or JPG and save it.
# We will create an optimized PNG file that we can use to replace the 12MB SVG.
compress_image(
    os.path.join(assets_dir, "awards-pic.png"),
    os.path.join(assets_dir, "awards-pic-optimized.png"),
    max_width=800
)

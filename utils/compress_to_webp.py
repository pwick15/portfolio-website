#!/usr/bin/env python3
import os
import sys
import argparse
import shutil
from PIL import Image

def get_target_max_width(filepath, default_max):
    # Detect subfolder context for smart default resizing
    abs_path = os.path.abspath(filepath)
    if "icons" in abs_path:
        return 128
    elif "images" in abs_path or "projects" in abs_path:
        return 1000
    return default_max

def convert_to_webp(src_path, quality=80, max_width=None, archive_orig=True):
    if not os.path.exists(src_path):
        print(f"❌ File not found: {src_path}")
        return None
    
    # Check if file is already WebP
    filename, ext = os.path.splitext(os.path.basename(src_path))
    if ext.lower() == '.webp':
        print(f"ℹ️ {src_path} is already a WebP image. Skipping.")
        return None

    # Supported extensions
    valid_exts = {'.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp'}
    if ext.lower() not in valid_exts:
        print(f"⚠️ Skipping non-image file: {src_path}")
        return None

    dest_dir = os.path.dirname(src_path)
    dest_path = os.path.join(dest_dir, f"{filename}.webp")

    try:
        img = Image.open(src_path)
        orig_size = os.path.getsize(src_path) / 1024  # in KB
        
        # Determine max width contextually
        target_w = get_target_max_width(src_path, max_width)

        # Preserve transparency channel if saving to webp
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
            
        # Resize if width exceeds target_w
        if target_w and img.size[0] > target_w:
            aspect_ratio = img.size[1] / img.size[0]
            new_height = int(target_w * aspect_ratio)
            img = img.resize((target_w, new_height), Image.Resampling.LANCZOS)
            print(f"📐 Resized {filename}{ext} to {target_w}x{new_height}")
            
        # Save as WEBP
        img.save(dest_path, "WEBP", quality=quality, method=6)
        
        new_size = os.path.getsize(dest_path) / 1024  # in KB
        reduction = (1 - (new_size / orig_size)) * 100
        print(f"✅ Converted: {filename}{ext} -> {filename}.webp ({orig_size:.1f}KB -> {new_size:.1f}KB | -{reduction:.1f}%)")

        # Archive original file
        if archive_orig:
            # Reconstruct workspace layout inside archive
            workspace_dir = "/Users/punjayawickramasinghe/dev/portfolio-website"
            archive_dir = os.path.join(workspace_dir, "assets", "archive")
            os.makedirs(archive_dir, exist_ok=True)
            
            archive_path = os.path.join(archive_dir, os.path.basename(src_path))
            # If archive file already exists, avoid collision by appending unique suffix
            counter = 1
            base_archive_name = os.path.basename(src_path)
            while os.path.exists(archive_path):
                name_part, ext_part = os.path.splitext(base_archive_name)
                archive_path = os.path.join(archive_dir, f"{name_part}_{counter}{ext_part}")
                counter += 1
                
            shutil.move(src_path, archive_path)
            print(f"📦 Moved original to: assets/archive/{os.path.basename(archive_path)}")

        return {
            "old_rel": os.path.relpath(src_path, start="/Users/punjayawickramasinghe/dev/portfolio-website"),
            "new_rel": os.path.relpath(dest_path, start="/Users/punjayawickramasinghe/dev/portfolio-website")
        }

    except Exception as e:
        print(f"❌ Error converting {src_path}: {e}")
        return None

def update_code_references(replacements):
    if not replacements:
        return
        
    workspace_dir = "/Users/punjayawickramasinghe/dev/portfolio-website"
    code_files = [
        os.path.join(workspace_dir, "index.html"),
        os.path.join(workspace_dir, "script.js"),
        os.path.join(workspace_dir, "style.css"),
        os.path.join(workspace_dir, "README.md")
    ]
    
    for filepath in code_files:
        if not os.path.exists(filepath):
            continue
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            updated_content = content
            replacements_made = 0
            
            # Sort replacements by old string length descending to avoid partial matches
            for rep in sorted(replacements, key=lambda x: len(x["old_rel"]), reverse=True):
                old_str = rep["old_rel"]
                new_str = rep["new_rel"]
                
                # Check with and without leading "./"
                for prefix in ["", "./"]:
                    target_old = prefix + old_str
                    target_new = prefix + new_str
                    if target_old in updated_content:
                        updated_content = updated_content.replace(target_old, target_new)
                        replacements_made += 1
                        
            if replacements_made > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"📝 Updated {replacements_made} references in {os.path.basename(filepath)}")
        except Exception as e:
            print(f"❌ Error updating references in {filepath}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Convert images to optimized WebP format.")
    parser.add_argument("paths", nargs="*", help="File or folder paths to convert.")
    parser.add_argument("--all", action="store_true", help="Scan and convert all assets in the assets/ directory (excluding archive/).")
    parser.add_argument("--max-width", type=int, default=1000, help="Default max width for image resizing (default: 1000 for standard images, 128 for icons).")
    parser.add_argument("--quality", type=int, default=80, help="WebP quality factor from 1-100 (default: 80).")
    parser.add_argument("--keep-original", action="store_true", help="Do not move original files to assets/archive/.")
    parser.add_argument("--no-code-update", action="store_true", help="Do not automatically scan and update references in code files.")

    args = parser.parse_args()
    
    workspace_dir = "/Users/punjayawickramasinghe/dev/portfolio-website"
    assets_dir = os.path.join(workspace_dir, "assets")
    archive_dir = os.path.join(assets_dir, "archive")
    
    files_to_convert = []
    
    if args.all:
        print("🔍 Scanning assets folder for convertible images...")
        for root, dirs, files in os.walk(assets_dir):
            # Skip the archive folder
            if os.path.abspath(root).startswith(os.path.abspath(archive_dir)):
                continue
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in {'.png', '.jpg', '.jpeg', '.bmp', '.tiff'}:
                    files_to_convert.append(os.path.join(root, file))
    elif args.paths:
        for path in args.paths:
            abs_path = os.path.abspath(path)
            if not os.path.exists(abs_path):
                # Try relative to workspace
                abs_path = os.path.join(workspace_dir, path)
                
            if os.path.isdir(abs_path):
                for root, dirs, files in os.walk(abs_path):
                    if os.path.abspath(root).startswith(os.path.abspath(archive_dir)):
                        continue
                    for file in files:
                        ext = os.path.splitext(file)[1].lower()
                        if ext in {'.png', '.jpg', '.jpeg', '.bmp', '.tiff'}:
                            files_to_convert.append(os.path.join(root, file))
            elif os.path.isfile(abs_path):
                files_to_convert.append(abs_path)
    else:
        print("❌ Please specify file/directory paths or use --all.")
        parser.print_help()
        sys.exit(1)
        
    if not files_to_convert:
        print("🤷 No convertible images found.")
        sys.exit(0)
        
    print(f"🎬 Found {len(files_to_convert)} files to convert.")
    
    replacements = []
    archive_orig = not args.keep_original
    
    for filepath in files_to_convert:
        res = convert_to_webp(filepath, quality=args.quality, max_width=args.max_width, archive_orig=archive_orig)
        if res:
            replacements.append(res)
            
    if not args.no_code_update and replacements:
        print("\n🔍 Checking for code references to update...")
        update_code_references(replacements)
        
    print("\n🎉 Conversion batch complete!")

if __name__ == "__main__":
    main()

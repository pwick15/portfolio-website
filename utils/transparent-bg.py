from PIL import Image
import os

def white_to_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")  # Ensure it has alpha channel

    datas = img.getdata()
    new_data = []
    for item in datas:
        # White pixel (255, 255, 255) or (255, 255, 255, 255)
        if item[:3] == (255, 255, 255):
            new_data.append((255, 255, 255, 0))  # Make it transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")  # Save as PNG to preserve transparency

# Example usage
input_file = "/Users/punjayawickramasinghe/dev/portfolio-website/assets/profile-pic-og.png"  # Can also be .jpeg or .png
output_file = "output.png"  # Must be .png to support transparency

white_to_transparent(input_file, output_file)
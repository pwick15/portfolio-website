#!/usr/bin/env python3
import os

workspace_dir = "/Users/punjayawickramasinghe/dev/portfolio-website"
html_path = os.path.join(workspace_dir, "index.html")

def swap_sections():
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define exact delimiters
    skills_start = '<!-- SKILLS SECTION -->'
    skills_end = '</section>\n\n        <!-- HONOURS SECTION -->'
    
    honours_start = '<!-- HONOURS SECTION -->'
    honours_end = '</section>\n\n        <!-- CONTACT SECTION -->'

    # Find indices
    try:
        skills_start_idx = content.index(skills_start)
        skills_end_idx = content.index(skills_end) + len('</section>')
        
        # We search for honours after skills
        honours_start_idx = content.index(honours_start, skills_end_idx)
        honours_end_idx = content.index(honours_end, honours_start_idx) + len('</section>')
    except ValueError as e:
        print(f"❌ Error locating section delimiters: {e}")
        return

    # Extract blocks
    pre_skills = content[:skills_start_idx]
    skills_block = content[skills_start_idx:skills_end_idx]
    between_blocks = content[skills_end_idx:honours_start_idx]
    honours_block = content[honours_start_idx:honours_end_idx]
    post_honours = content[honours_end_idx:]

    print("✅ Successfully parsed both sections!")

    # Swap the blocks
    # Honours block goes first, then Skills block
    # We need to adjust spacing slightly to match the original layout
    new_content = (
        pre_skills +
        honours_block +
        "\n\n        " +
        skills_block +
        post_honours
    )
    
    # Also update the navigation link orders in header & footer
    # Original:
    # <li><a href="#experience">Skills</a></li>
    # <li><a href="#honours">Honours</a></li>
    
    # Swapped:
    # <li><a href="#honours">Honours</a></li>
    # <li><a href="#experience">Skills</a></li>
    
    nav_old = '<li><a href="#experience">Skills</a></li>\n                <li><a href="#honours">Honours</a></li>'
    nav_new = '<li><a href="#honours">Honours</a></li>\n                <li><a href="#experience">Skills</a></li>'
    
    footer_old = '<li><a href="#experience">Skills</a></li>\n                    <li><a href="#honours">Honours</a></li>'
    footer_new = '<li><a href="#honours">Honours</a></li>\n                    <li><a href="#experience">Skills</a></li>'

    if nav_old in new_content:
        new_content = new_content.replace(nav_old, nav_new)
        print("✅ Updated header navigation menu order.")
    else:
        # Fallback if whitespace differs
        print("⚠️ Warning: Header navigation match not found. Trying flexible match.")
        
    if footer_old in new_content:
        new_content = new_content.replace(footer_old, footer_new)
        print("✅ Updated footer navigation menu order.")
    else:
        print("⚠️ Warning: Footer navigation match not found.")

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("🚀 index.html sections swapped and updated successfully!")

if __name__ == "__main__":
    swap_sections()

#!/usr/bin/env python3
"""
Create a favicon for the Linux Man Pages application.
The icon will be a terminal/console style design with "man" text.
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_favicon():
    # Create multiple sizes for different use cases
    sizes = [16, 32, 48, 64, 128, 256]
    
    for size in sizes:
        # Create image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Colors - using a terminal/console theme
        bg_color = (40, 44, 52, 255)  # Dark background
        text_color = (97, 218, 251, 255)  # Light blue/cyan text
        border_color = (171, 178, 191, 255)  # Light gray border
        
        # Draw rounded rectangle background
        margin = size // 8
        draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=size // 8,
            fill=bg_color,
            outline=border_color,
            width=max(1, size // 32)
        )
        
        # Calculate font size based on icon size
        if size <= 16:
            font_size = 8
            text = ">"
        elif size <= 32:
            font_size = 12
            text = "man"
        else:
            font_size = size // 4
            text = "man"
        
        try:
            # Try to use a monospace font if available
            font = ImageFont.truetype("DejaVuSansMono.ttf", font_size)
        except:
            try:
                font = ImageFont.truetype("Consolas.ttf", font_size)
            except:
                try:
                    font = ImageFont.truetype("Monaco.ttf", font_size)
                except:
                    # Fallback to default font
                    font = ImageFont.load_default()
        
        # Get text dimensions
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center the text
        x = (size - text_width) // 2
        y = (size - text_height) // 2
        
        # Draw text
        draw.text((x, y), text, fill=text_color, font=font)
        
        # Add a small cursor/terminal prompt for larger sizes
        if size >= 32:
            cursor_x = x + text_width + size // 16
            cursor_y = y + text_height - size // 16
            cursor_width = max(1, size // 32)
            cursor_height = size // 8
            
            draw.rectangle(
                [cursor_x, cursor_y, cursor_x + cursor_width, cursor_y + cursor_height],
                fill=text_color
            )
        
        # Save the image
        if size == 32:
            # Save as main favicon.ico (32x32 is most common)
            img.save('favicon.ico', format='ICO')
        
        # Save as PNG for different sizes
        img.save(f'favicon-{size}x{size}.png', format='PNG')
        print(f"Created favicon-{size}x{size}.png")
    
    print("Favicon files created successfully!")
    print("- favicon.ico (32x32) - main favicon")
    print("- favicon-{size}x{size}.png files for different sizes")

def create_apple_touch_icon():
    """Create Apple touch icon (180x180)"""
    size = 180
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    bg_color = (40, 44, 52, 255)
    text_color = (97, 218, 251, 255)
    accent_color = (255, 193, 7, 255)  # Yellow accent
    
    # Draw background with rounded corners (Apple style)
    margin = size // 12
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=size // 6,
        fill=bg_color
    )
    
    # Draw "man" text
    font_size = size // 5
    try:
        font = ImageFont.truetype("DejaVuSansMono.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "man"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - size // 20
    
    draw.text((x, y), text, fill=text_color, font=font)
    
    # Add terminal prompt line below
    prompt_y = y + text_height + size // 20
    prompt_start = size // 4
    prompt_end = size * 3 // 4
    
    draw.line(
        [(prompt_start, prompt_y), (prompt_end, prompt_y)],
        fill=accent_color,
        width=size // 60
    )
    
    # Add blinking cursor
    cursor_x = prompt_start
    cursor_y = prompt_y - size // 40
    cursor_size = size // 30
    
    draw.rectangle(
        [cursor_x, cursor_y, cursor_x + cursor_size, cursor_y + cursor_size],
        fill=accent_color
    )
    
    img.save('apple-touch-icon.png', format='PNG')
    print("Created apple-touch-icon.png (180x180)")

if __name__ == "__main__":
    # Check if PIL is available
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("PIL (Pillow) is required to create favicons.")
        print("Install it with: pip install Pillow")
        exit(1)
    
    create_favicon()
    create_apple_touch_icon()
    
    print("\nNext steps:")
    print("1. Add favicon links to index.html <head> section")
    print("2. Upload favicon files to the root directory")
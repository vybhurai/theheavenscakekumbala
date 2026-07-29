import re

content = open('script.js', 'r', encoding='utf-8').read()
matches = re.findall(r'{ name:\s*"([^"]+)",.*?img:\s*"([^"]+)"', content)

placeholders = ['about_display.jpg', 'prod_strawberry.jpg', 'cat_birthday.jpg', 'cat_cookies.jpg', 'about_crafting.jpg', 'cat_kids.jpg', 'hero_chocolate.jpg', 'cat_photo.jpg', 'cat_cupcakes.jpg', 'cat_desserts.jpg', 'cat_brownies.jpg', 'cat_wedding.jpg']

needs_image = []
for name, img in matches:
    if any(p in img for p in placeholders):
        needs_image.append(name)

print(f'Found {len(needs_image)} items needing unique images.')

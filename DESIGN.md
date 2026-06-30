# Design

## Aesthetic: Modern Dark Mode

- **Background Color**: `#121212` (Deep Dark)
- **Surface Color**: `#1E1E1E` (Card background)
- **Primary Accent**: `#4CAF50` (YTS green aesthetic)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#B3B3B3`
- **Typography**: `Inter`, sans-serif (Clean, modern)

## Layout Structure

1. **Header**: 
   - Logo / Title on the left.
   - Search bar in the center/right.
2. **Main Content (Grid)**:
   - A responsive CSS grid displaying movie cards.
   - Movie Card:
     - Poster image (fill card).
     - Title, year, and rating.
3. **Movie Details Modal**:
   - A centered overlay.
   - Shows full poster, title, year, rating, description, and genres.
   - Lists available torrent qualities (720p, 1080p, etc.) as clickable magnet download buttons.
4. **Pagination**:
   - "Load More" button at the bottom of the grid.

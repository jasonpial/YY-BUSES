// Currency Formatter
export const formatUGX = (amount) => {
  if (amount === undefined || amount === null) return 'UGX 0';
  return 'UGX ' + Math.round(amount).toLocaleString('en-UG');
};

// Generate a random ID
export const generateId = (prefix = 'YY', length = 6) => {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
};

// Format dates nicely
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  
  // Check if today
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  }
  
  // Check if yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  }
  
  return date.toLocaleDateString('en-US', options);
};

// Estimate Courier Price
// Base charge + (Weight * perKgRate)
export const calculateCourierPrice = (weight, routeBase, routePerKg, isFragile = false, size = 'medium') => {
  let base = routeBase;
  let perKg = routePerKg;
  
  let price = base + (weight * perKg);
  
  // Size multiplier
  if (size === 'small') price *= 0.9;
  if (size === 'large') price *= 1.25;
  if (size === 'extra-large') price *= 1.6;
  
  // Fragile charge
  if (isFragile) {
    price += 5000; // flat UGX 5,000 handling fee
  }
  
  // Round to nearest 100 UGX
  return Math.ceil(price / 100) * 100;
};

// Pure SVG Barcode Generator
export const generateBarcodeSVG = (value) => {
  // Simple seed to generate random-looking bar widths based on the input text
  const seed = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let x = 10;
  let bars = '';
  
  for (let i = 0; i < 40; i++) {
    const width = ((seed + i) % 3) + 1; // bar width: 1, 2, or 3px
    const spacing = ((seed * (i + 1)) % 4) + 1; // space: 1, 2, 3, or 4px
    const isDark = (seed + i) % 2 === 0;
    
    if (isDark) {
      bars += `<rect x="${x}" y="10" width="${width}" height="50" fill="black" />`;
      x += width + spacing;
    } else {
      x += spacing;
    }
  }
  
  return `
    <svg width="220" height="80" viewBox="0 0 ${x + 10} 80" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white" />
      ${bars}
      <text x="50%" y="72" font-family="'Inter', sans-serif" font-size="10" text-anchor="middle" fill="black" letter-spacing="2">${value}</text>
    </svg>
  `;
};

// Pure SVG QR Code Generator
export const generateQRCodeSVG = (value) => {
  // Create a pseudo-random grid representation based on a simple hash of value
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash) + value.charCodeAt(i);
  }
  
  const size = 15; // 15x15 grids
  const padding = 10;
  const cellSize = 6;
  const qrSize = size * cellSize + padding * 2;
  
  let rects = '';
  
  // Finder pattern top-left
  rects += `<rect x="${padding}" y="${padding}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#7a0016" />`;
  rects += `<rect x="${padding + cellSize}" y="${padding + cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="white" />`;
  rects += `<rect x="${padding + cellSize * 2}" y="${padding + cellSize * 2}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#7a0016" />`;
  
  // Finder pattern top-right
  rects += `<rect x="${padding + (size - 7) * cellSize}" y="${padding}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#7a0016" />`;
  rects += `<rect x="${padding + (size - 6) * cellSize}" y="${padding + cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="white" />`;
  rects += `<rect x="${padding + (size - 5) * cellSize}" y="${padding + cellSize * 2}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#7a0016" />`;
  
  // Finder pattern bottom-left
  rects += `<rect x="${padding}" y="${padding + (size - 7) * cellSize}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#7a0016" />`;
  rects += `<rect x="${padding + cellSize}" y="${padding + (size - 6) * cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="white" />`;
  rects += `<rect x="${padding + cellSize * 2}" y="${padding + (size - 5) * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#7a0016" />`;
  
  // Random content blocks
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Skip finder pattern areas
      if ((row < 8 && col < 8) || (row < 8 && col >= size - 8) || (row >= size - 8 && col < 8)) {
        continue;
      }
      
      const seedVal = Math.sin(hash + row * 13 + col * 37) * 10000;
      const isBlack = (seedVal - Math.floor(seedVal)) > 0.45;
      
      if (isBlack) {
        const x = padding + col * cellSize;
        const y = padding + row * cellSize;
        rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#1a365d" />`;
      }
    }
  }
  
  return `
    <svg width="110" height="110" viewBox="0 0 ${qrSize} ${qrSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white" rx="4" />
      ${rects}
    </svg>
  `;
};

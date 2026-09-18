#!/usr/bin/env node
/**
 * UI/UX Pro Max Node.js Search Engine
 * High-speed, zero-dependency search for UI styles, palettes, font pairings, charts, and UX heuristics.
 *
 * Usage:
 *   node scripts/search.mjs "<query>" [--domain <domain>] [--limit <n>]
 *   node scripts/search.mjs "fintech dashboard" --domain style
 *   node scripts/search.mjs "minimal dark" --domain color
 *   node scripts/search.mjs "saas" --domain typography
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../src/ui-ux-pro-max/data');

const DOMAIN_FILES = {
  style: 'styles.csv',
  styles: 'styles.csv',
  color: 'colors.csv',
  colors: 'colors.csv',
  typography: 'typography.csv',
  ux: 'ux-guidelines.csv',
  chart: 'charts.csv',
  charts: 'charts.csv',
  landing: 'landing.csv',
  product: 'products.csv',
  products: 'products.csv',
  icons: 'icons.csv',
  motion: 'motion.csv',
  gsap: 'motion.csv',
  react: 'react-performance.csv',
  interface: 'app-interface.csv'
};

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];
  
  // Simple CSV parser supporting quotes
  function parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length >= headers.length) {
      const entry = {};
      headers.forEach((h, idx) => {
        entry[h] = values[idx] || '';
      });
      rows.push(entry);
    }
  }
  return rows;
}

function searchRows(rows, query, limit = 5) {
  if (!query || query.trim() === '') return rows.slice(0, limit);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  
  const scored = rows.map(row => {
    const text = Object.values(row).join(' ').toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (text.includes(term)) {
        score += 10;
        // Bonus if matches start of field or title
        for (const [key, val] of Object.entries(row)) {
          if (val.toLowerCase().includes(term)) {
            score += 5;
          }
        }
      }
    }
    return { row, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.row);
}

function main() {
  const args = process.argv.slice(2);
  let query = '';
  let domain = null;
  let limit = 5;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--domain' && args[i + 1]) {
      domain = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1], 10) || 5;
      i++;
    } else if (!args[i].startsWith('--')) {
      query = query ? `${query} ${args[i]}` : args[i];
    }
  }

  console.log(`\x1b[36m🔍 UI/UX Intelligence Search — Query: "${query || '*'}"${domain ? ` (Domain: ${domain})` : ''}\x1b[0m\n`);

  const domainsToSearch = domain && DOMAIN_FILES[domain] 
    ? { [domain]: DOMAIN_FILES[domain] }
    : DOMAIN_FILES;

  let totalMatches = 0;

  for (const [dom, file] of Object.entries(domainsToSearch)) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const rows = parseCSV(content);
    const matches = searchRows(rows, query, domain ? limit : 2);

    if (matches.length > 0) {
      totalMatches += matches.length;
      console.log(`\x1b[32m📁 DOMAIN: ${dom.toUpperCase()} (${file})\x1b[0m`);
      console.log('='.repeat(60));
      matches.forEach((m, idx) => {
        console.log(`\x1b[1m#${idx + 1}\x1b[0m`);
        for (const [k, v] of Object.entries(m)) {
          if (v && v.length > 0) {
            console.log(`  \x1b[33m${k}\x1b[0m: ${v}`);
          }
        }
        console.log('-'.repeat(40));
      });
      console.log('');
    }
  }

  if (totalMatches === 0) {
    console.log(`\x1b[33mNo exact matches found for "${query}". Try broader terms like "dashboard", "minimal", "modern", "saas", "dark", "fintech".\x1b[0m`);
  }
}

main();

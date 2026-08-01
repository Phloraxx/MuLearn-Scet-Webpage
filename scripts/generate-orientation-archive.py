#!/usr/bin/env python3
import argparse, csv, json, re, subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

EXCLUDED_ROW_NUMBERS = {6}  # accidental laptop/test upload

POSES = {
    'Spider-Man Pointing': 'pose-01',
    'Epic Handshake': 'pose-02',
    'Absolute Cinema': 'pose-03',
    'Drake Hotline Bling': 'pose-04',
    'Woman Yelling At Cat': 'pose-05',
    'Batman / Robin Freeze Slap': 'pose-06',
    'Running Away Balloon': 'pose-07',
    'American Chopper Argument': 'pose-08',
    'Anakin & Padmé': 'pose-09',
    'Two Guys on a Bus': 'pose-10',
    'Buff Doge vs Cheems': 'pose-11',
    'Evil Kermit': 'pose-12',
    'Scooby-Doo Mask Reveal': 'pose-13',
    'Distracted Boyfriend': 'pose-15',
}

def slug(value):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', value.lower())).strip('-')

def convert_one(job):
    source, thumb, full = job
    subprocess.run(['convert', str(source), '-auto-orient', '-strip', '-resize', '560x760>', '-quality', '76', '-define', 'webp:method=6', str(thumb)], check=True)
    subprocess.run(['convert', str(source), '-auto-orient', '-strip', '-resize', '1600x2200>', '-quality', '84', '-define', 'webp:method=6', str(full)], check=True)
    dims = subprocess.check_output(['identify', '-format', '%w %h', str(full)], text=True).split()
    return int(dims[0]), int(dims[1])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('csv')
    ap.add_argument('source_root')
    ap.add_argument('output_root')
    ap.add_argument('--reference-root', required=True)
    args = ap.parse_args()
    source_root, output_root = Path(args.source_root), Path(args.output_root)
    thumb_root, full_root, reference_root = output_root/'thumbs', output_root/'full', output_root/'references'
    thumb_root.mkdir(parents=True, exist_ok=True); full_root.mkdir(parents=True, exist_ok=True); reference_root.mkdir(parents=True, exist_ok=True)
    with open(args.csv, encoding='utf-8-sig', newline='') as handle:
        rows = list(csv.DictReader(handle))
    jobs, records = [], []
    for index, row in enumerate(rows, 1):
        if index in EXCLUDED_ROW_NUMBERS:
            continue
        pid = f'{index:03d}'
        source = source_root / row['archive_path']
        if not source.exists(): raise FileNotFoundError(source)
        thumb, full = thumb_root/f'{pid}.webp', full_root/f'{pid}.webp'
        jobs.append((source, thumb, full))
        records.append({'id': pid, 'team': row['team'], 'teamSlug': row['team_slug'], 'meme': row['meme_pose'], 'memeSlug': slug(row['meme_pose']), 'reference': f"{POSES[row['meme_pose']]}.webp", 'thumb': f'/assets/orientation/archive/thumbs/{pid}.webp', 'full': f'/assets/orientation/archive/full/{pid}.webp'})
    with ThreadPoolExecutor(max_workers=4) as pool:
        for i, dims in enumerate(pool.map(convert_one, jobs)):
            records[i]['width'], records[i]['height'] = dims
            records[i]['ratio'] = round(dims[0] / dims[1], 4)
            if (i + 1) % 25 == 0: print(f'processed {i+1}/{len(records)}', flush=True)
    for pose_id in sorted(set(POSES.values())):
        source = Path(args.reference_root)/f'{pose_id}.webp'
        subprocess.run(['convert', str(source), '-strip', '-resize', '1000x1000>', '-quality', '82', '-define', 'webp:method=6', str(reference_root/f'{pose_id}.webp')], check=True)
    manifest = {'count': len(records), 'teams': sorted({r['team'] for r in records}), 'memes': sorted({r['meme'] for r in records}), 'photos': records}
    (output_root/'manifest.json').write_text(json.dumps(manifest, separators=(',', ':'), ensure_ascii=False), encoding='utf-8')
    print(f'wrote {len(records)} anonymous records')
if __name__ == '__main__': main()

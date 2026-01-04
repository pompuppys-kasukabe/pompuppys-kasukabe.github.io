#!/usr/bin/env python3
"""
Instagram投稿自動取得スクリプト

Instagram公開ページから最新6件の投稿を取得して、
instagram-posts.jsonを自動更新します。
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: requests module not found. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests


def fetch_instagram_posts(username, count=6):
    """
    InstagramユーザーのプロフィールページからJSON-LDデータを取得

    Args:
        username: Instagramユーザー名
        count: 取得する投稿数

    Returns:
        投稿データのリスト
    """
    url = f"https://www.instagram.com/{username}/"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        print(f"📡 Fetching: {url}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        html_content = response.text

        # InstagramページからJSON-LDデータを抽出
        # ページ内に埋め込まれている <script type="application/ld+json"> を探す
        json_pattern = r'<script type="application/ld+json">({.*?})</script>'
        json_matches = re.findall(json_pattern, html_content, re.DOTALL)

        posts = []

        # または window._sharedData を探す（古い方法）
        shared_data_pattern = r'window\._sharedData = ({.*?});'
        shared_matches = re.findall(shared_data_pattern, html_content)

        if shared_matches:
            print("✓ Found window._sharedData")
            shared_data = json.loads(shared_matches[0])

            # ユーザーのメディア情報を取得
            try:
                user_data = shared_data['entry_data']['ProfilePage'][0]['graphql']['user']
                edges = user_data['edge_owner_to_timeline_media']['edges']

                for i, edge in enumerate(edges[:count]):
                    node = edge['node']
                    post = {
                        'id': f"post{i+1}",
                        'url': f"https://www.instagram.com/p/{node['shortcode']}/",
                        'image': node['display_url'],
                        'caption': ''
                    }

                    # キャプションを取得（存在する場合）
                    if 'edge_media_to_caption' in node and node['edge_media_to_caption']['edges']:
                        caption_text = node['edge_media_to_caption']['edges'][0]['node']['text']
                        post['caption'] = caption_text[:100]  # 100文字まで

                    posts.append(post)

                print(f"✓ Found {len(posts)} posts from window._sharedData")

            except (KeyError, IndexError) as e:
                print(f"⚠ Error parsing window._sharedData: {e}")

        # window._sharedDataで取得できなかった場合、別の方法を試す
        if not posts:
            print("⚠ window._sharedData not found, trying alternative method...")

            # shortcode を正規表現で探す
            shortcode_pattern = r'{"shortcode":"([A-Za-z0-9_-]+)"'
            shortcodes = re.findall(shortcode_pattern, html_content)

            # 重複を除去して最初の6件を取得
            unique_shortcodes = []
            seen = set()
            for sc in shortcodes:
                if sc not in seen and len(unique_shortcodes) < count:
                    seen.add(sc)
                    unique_shortcodes.append(sc)

            if unique_shortcodes:
                print(f"✓ Found {len(unique_shortcodes)} unique shortcodes")
                for i, shortcode in enumerate(unique_shortcodes):
                    posts.append({
                        'id': f"post{i+1}",
                        'url': f"https://www.instagram.com/p/{shortcode}/",
                        'image': f"https://www.instagram.com/p/{shortcode}/media/?size=l",
                        'caption': ''
                    })

        if not posts:
            raise Exception("投稿データを取得できませんでした")

        return posts

    except requests.RequestException as e:
        print(f"❌ Error fetching Instagram: {e}")
        raise
    except Exception as e:
        print(f"❌ Error parsing data: {e}")
        raise


def update_json_file(posts, output_path):
    """
    投稿データをJSONファイルに保存

    Args:
        posts: 投稿データのリスト
        output_path: 出力ファイルパス
    """
    data = {
        'posts': posts,
        '_comment': f'自動更新: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
        '_last_update': datetime.now().isoformat()
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✓ Saved to {output_path}")


def main():
    """メイン処理"""
    username = "pompuppysbright"
    count = 6

    # スクリプトの位置から相対的にJSONファイルのパスを決定
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    json_file = repo_root / "instagram-posts.json"

    print("=" * 50)
    print("🤖 Instagram投稿自動取得スクリプト")
    print("=" * 50)
    print(f"ユーザー名: @{username}")
    print(f"取得件数: {count}件")
    print(f"出力先: {json_file}")
    print()

    try:
        # Instagram投稿を取得
        posts = fetch_instagram_posts(username, count)

        print()
        print(f"✓ {len(posts)}件の投稿を取得しました")
        print()

        # 取得した投稿を表示
        for i, post in enumerate(posts, 1):
            print(f"{i}. {post['url']}")
            if post['caption']:
                caption_preview = post['caption'][:50] + '...' if len(post['caption']) > 50 else post['caption']
                print(f"   {caption_preview}")

        print()

        # JSONファイルに保存
        update_json_file(posts, json_file)

        print()
        print("=" * 50)
        print("✅ 完了しました！")
        print("=" * 50)

        return 0

    except Exception as e:
        print()
        print("=" * 50)
        print(f"❌ エラーが発生しました: {e}")
        print("=" * 50)
        return 1


if __name__ == "__main__":
    sys.exit(main())

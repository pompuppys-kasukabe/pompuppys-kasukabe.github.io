#!/bin/bash
# Instagram投稿自動更新のテストスクリプト

set -e

echo "=================================================="
echo "🧪 Instagram投稿自動更新 テスト実行"
echo "=================================================="
echo ""

# スクリプトのディレクトリに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "📍 作業ディレクトリ: $(pwd)"
echo ""

# Python環境確認
echo "🐍 Python環境確認..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 がインストールされていません"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✓ $PYTHON_VERSION"
echo ""

# requests モジュール確認
echo "📦 依存関係確認..."
if ! python3 -c "import requests" 2>/dev/null; then
    echo "⚠️  requests モジュールがインストールされていません"
    echo "📥 インストール中..."
    pip3 install requests
    echo "✓ インストール完了"
else
    echo "✓ requests モジュールは既にインストールされています"
fi
echo ""

# バックアップ作成
if [ -f "instagram-posts.json" ]; then
    echo "💾 バックアップ作成..."
    cp instagram-posts.json instagram-posts.json.backup
    echo "✓ instagram-posts.json.backup を作成しました"
    echo ""
fi

# スクリプト実行
echo "🚀 Instagram投稿取得スクリプト実行..."
echo ""
python3 scripts/update-instagram.py

# 結果確認
echo ""
echo "=================================================="
echo "📊 実行結果"
echo "=================================================="

if [ -f "instagram-posts.json" ]; then
    echo "✓ instagram-posts.json が更新されました"
    echo ""

    # JSONの内容を表示
    echo "📄 更新内容プレビュー:"
    echo ""

    # jq がインストールされていれば整形表示、なければそのまま表示
    if command -v jq &> /dev/null; then
        cat instagram-posts.json | jq '.'
    else
        cat instagram-posts.json
    fi

    echo ""

    # 投稿数をカウント
    POST_COUNT=$(python3 -c "import json; data = json.load(open('instagram-posts.json')); print(len(data.get('posts', [])))")
    echo "📸 取得した投稿数: ${POST_COUNT}件"

else
    echo "❌ instagram-posts.json が見つかりません"
    exit 1
fi

echo ""
echo "=================================================="
echo "✅ テスト完了"
echo "=================================================="
echo ""
echo "次のステップ:"
echo "1. 取得した投稿内容を確認"
echo "2. 問題なければ git add & commit & push"
echo "3. バックアップが不要なら削除: rm instagram-posts.json.backup"
echo ""

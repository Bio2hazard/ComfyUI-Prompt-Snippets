"""
This module provides a prompt autocompletion feature for ComfyUI Prompt Snippets.

It defines an API endpoint `/csvexp/get_words` that serves autocompletion data from
JSON and CSV files. The data is cached in memory to avoid reading files on every
request.
"""

import os
import json
from aiohttp import web
import server
import folder_paths

WEB_DIRECTORY = "js"
# Cache for the autocomplete data
word_cache = None

@server.PromptServer.instance.routes.get("/cps/get_words")
async def get_words(request):
    """
    Handles the HTTP request to get the autocomplete words.

    This function reads all .json and .csv files from the default `js/data`
    directory and a user-specific directory, then returns the data as a JSON
    response. The data is cached in memory to improve performance.

    Args:
        request: The aiohttp request object.

    Returns:
        A web.json_response containing the autocomplete data.
    """
    global word_cache
    # For now, we'll cache indefinitely. A file watcher could be added later
    # to invalidate the cache when files change.
    if word_cache is not None:
        return web.json_response(word_cache)

    default_data_dir = os.path.join(os.path.dirname(__file__), "js", "data")
    user_data_dir = None
    base_user_dir = None

    # The following logic is to find the user directory in a robust way.
    # It tries to find the user directory in the following order:
    # 1. Using the user_manager (if available)
    # 2. Using folder_paths.get_user_directory()
    # 3. A final fallback to the default location

    # 1. Try user_manager
    try:
        user_manager = server.PromptServer.instance.user_manager
        base_user_dir = user_manager.get_request_user_filepath(request, None, create_dir=False)
        if not base_user_dir or not os.path.exists(base_user_dir):
             base_user_dir = None
    except Exception as e:
        print(f"[COMFYUI_PROMPT_SNIPPETS] Failed to get user directory from user_manager: {e}")
        base_user_dir = None

    # 2. Fallback to folder_paths
    if not base_user_dir:
        try:
            user_root = folder_paths.get_user_directory()
            if user_root and os.path.isdir(user_root):
                base_user_dir = os.path.join(user_root, 'default')
        except Exception as e:
            print(f"[COMFYUI_PROMPT_SNIPPETS] Failed to get user directory from folder_paths: {e}")
            base_user_dir = None

    # 3. Final fallback
    if not base_user_dir:
        try:
            comfyui_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
            base_user_dir = os.path.join(comfyui_root, 'user', 'default')
        except Exception as e:
            print(f"[COMFYUI_PROMPT_SNIPPETS] Failed to get user directory from final fallback: {e}")
            base_user_dir = None


    # Create directories and set final user_data_dir
    if base_user_dir:
        try:
            os.makedirs(base_user_dir, exist_ok=True)
            user_data_dir = os.path.join(base_user_dir, "comfyui-prompt-snippets")
            
            is_new_dir = not os.path.exists(user_data_dir)
            
            os.makedirs(user_data_dir, exist_ok=True)

            if is_new_dir:
                # Create example files
                with open(os.path.join(user_data_dir, "gadget.csv.example"), "w") as f:
                    f.write("headphones\ncellphone\nflashlight\n")
                
                custom_chara = {
                    "victory-kun": "(1boy:1.85), adult, white hair, green eyes, victory pose, white sneakers, :D, dutch angle, solo, detailed background"
                }
                with open(os.path.join(user_data_dir, "custom_chara.json.example"), "w") as f:
                    json.dump(custom_chara, f, indent=4)

        except Exception as e:
            print(f"[COMFYUI_PROMPT_SNIPPETS] Error creating user directory or example files: {e}")
            user_data_dir = None

    words = {}
    categories = []

    def process_directory(directory):
        """
        Processes a directory to extract autocomplete data from .json and .csv files.
        """
        if not directory or not os.path.exists(directory):
            return
        for filename in os.listdir(directory):
            category = os.path.splitext(filename)[0]
            if category.endswith('.example'):
                continue
            if category not in categories:
                categories.append(category)
            filepath = os.path.join(directory, filename)
            if filename.endswith(".json"):
                with open(filepath, 'r', encoding='utf-8') as f:
                    try:
                        words[category] = json.load(f)
                    except json.JSONDecodeError:
                        print(f"Error decoding JSON from {filename}")
            elif filename.endswith(".csv"):
                with open(filepath, 'r', encoding='utf-8') as f:
                    words[category] = [line.strip() for line in f if line.strip()]

    process_directory(default_data_dir)
    if user_data_dir:
        process_directory(user_data_dir)

    word_cache = {"words": words, "categories": sorted(categories)}
    return web.json_response(word_cache)

# This node is not needed for the extension to work.
# We are only using the web directory feature.
NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']

#!/bin/bash
# Note: must be run from scripts folder

# current directory path
scripts_dir_absolute=$(pwd)

# absolute path to icons.ts dictionary file
icons_dict_ts="/src/global/components/icon/icons.ts"

# absolute path to icons directory
icons_dir="/public/assets/icons"

# html src path
icons_dir_src="/assets/icons/"

# temporary text file to store the list of icons
temp_text_file="all.txt"

# ---------------
# Update icons.ts dictionary
# ---------------

cd "../$icons_dir"

ls > "$scripts_dir_absolute/$temp_text_file"

echo "export const icons = {" > "$scripts_dir_absolute/../$icons_dict_ts"

cat "$scripts_dir_absolute/$temp_text_file" | while read line; do
	if ! grep -q "$line" "$scripts_dir_absolute/../$icons_dict_ts"; then
		echo "\t'${line%.svg}': '$icons_dir_src$line'," >> "$scripts_dir_absolute/../$icons_dict_ts"
	fi
done

echo "} as const;" >> "$scripts_dir_absolute/../$icons_dict_ts"

# ---------------
# Print icons.ts dictionary
# ---------------

cat "$scripts_dir_absolute/$temp_text_file"

rm "$scripts_dir_absolute/$temp_text_file"
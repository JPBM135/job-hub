for file in ./migrations/*.js; do
  if [ -f "$file" ]; then
    mv "$file" "${file%.js}.mjs"
    echo "Renamed file $file to ${file%.js}.mjs"
  fi
done
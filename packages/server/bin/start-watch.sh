concurrently -k -n swc,tsc,server -c green,blue,yellow \
	"swc src --out-dir ./dist -w --sync --strip-leading-paths" \
	"tsc -w --skipLibCheck --noEmit" \
	"nodemon --watch src --ext ts --exec 'yarn start'"
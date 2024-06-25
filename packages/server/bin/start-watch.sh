concurrently -k -n swc,tsc,server -c green,blue,yellow \
	"swc src --out-dir ./dist -w --sync" \
	"tsc -w --skipLibCheck --noEmit" \
	"nodemon --watch src --ext ts --exec 'yarn start'"
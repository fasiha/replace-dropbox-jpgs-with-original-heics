First, we go into the Photos directory:
```console
cd "~/Pictures/Photos Library.photoslibrary/originals"
find -type f -name "*.heic" | xargs exiftool -GPSTimeStamp -GPSPosition -CreateDate -LensModel > ~/Dropbox/replace-dropbox-jpgs-with-original-heics/heics.txt
```

Then, in the Dropbox "Camera Uploads" folder:
```console
find -type f -iname "*.jpg" -print0 | xargs -0 exiftool -GPSTimeStamp -GPSPosition -CreateDate -LensModel > ~/Dropbox/replace-dropbox-jpgs-with-original-heics/jpgs.txt
```

Commands are slightly different:
- `find` takes `-iname` for case-insensitive names in the latter;
- also it takes `-print0` and `xargs` takes `-0` to deal with whitespace in filenames.

Then, with Node.js installed, run
```console
node index.js > cmds.sh

export SRC=~/Pictures/Photos Library.photoslibrary/originals
export TARGET=~/Dropbox/replace-dropbox-jpgs-with-original-heics
sh cmds.sh
```
# 制作视频直播源

## Nginx + ffmpeg

### 1. 安装 Nginx 和配置

OSX 安装：

```bash
$ brew tap homebrew/nginx
# 报错，homebrew/nginx was deprecated. This tap is now empty as all its formulae were migrated.
# 所以换了一个仓库
$ brew tap denji/nginx
$ brew install nginx-full --with-rtmp-module
```

我们找到 nginx 的配置文件 nginx.conf。

RTMP 配置：

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
  # ...
    server {
        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /usr/local/var/www;
            add_header Cache-Control no-cache;
        }
    }
}

rtmp {
    server {
        listen 1935;
        chunk_size 4000;

        # rtmp 直播流配置
        application rtmplive {
            live on;
            max_connections 1024;
        }

        # hls 直播流配置
        application hls {
            live on;
            hls on;
            hls_path /usr/local/var/www/hls;
            hls_fragment 5s;
        }
    }
}
```

### 2. 安装 ffmpeg

OSX 安装：

```bash
$ brew install ffmpeg
```

### 3. 视频准备

直接去网上下载视频就行了。

### 4. 推流

```bash
# 推 hls 流，使用safari浏览器可以看到结果 http://localhost:8080/hls/live.m3u8
$ ffmpeg -re -i test.mp4 -vcodec libx264 -acodec aac -f flv rtmp://localhost:1935/hls/live
# 推 rtmp 流，使用 VTC 视频软件查看
$ ffmpeg -re -i test.mp4 -vcodec libx264 -acodec aac -f flv rtmp://localhost:1935/rtmplive/live
```


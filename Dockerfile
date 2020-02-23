# build
FROM registry.cn-hangzhou.aliyuncs.com/zh-base/blog:latest

WORKDIR /usr/src/app

COPY . .

RUN yarn build

# static file server
FROM nginx:1.17.0

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app/.vuepress/dist ./public
COPY --from=0 /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80
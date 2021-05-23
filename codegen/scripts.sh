docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
    -i /local/voicechat-alphas/reference/rooms.v1.yaml  \
    -g typescript-fetch \
    -o /local/api/fetch/
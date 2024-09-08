FROM gcr.io/buildpacks/google-22/run
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
USER 33:33

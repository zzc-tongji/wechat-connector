#include <signal.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "whereami.h"

int main(int argc, char *argv[])
{
  signal(SIGTERM, signalHandler);
  signal(SIGINT, signalHandler);
  pause();
}

void signalHandler(int signum)
{
  int length = wai_getExecutablePath(NULL, 0, NULL);
  int dirname_length = 0;
  int docker_stop_sh_path_length = length + 15 + 1; // The length of "/docker-stop.sh" is 15.
  char *docker_stop_sh_path = (char *)malloc(docker_stop_sh_path_length);
  wai_getExecutablePath(docker_stop_sh_path, length, &dirname_length);
  strcpy(docker_stop_sh_path + dirname_length, "/docker-stop.sh");
  system(docker_stop_sh_path);
}

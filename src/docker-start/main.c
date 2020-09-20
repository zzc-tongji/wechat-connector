#include <signal.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "whereami.h"

void signalHandler(int signum)
{
  int length = wai_getExecutablePath(NULL, 0, NULL);
  int dirname_length = 0;
  int docker_stop_sh_length = length + 15 + 1; // 15 is the length of "/docker-stop.sh".
  char *docker_stop_sh = (char *)malloc(docker_stop_sh_length);
  wai_getExecutablePath(docker_stop_sh, length, &dirname_length);
  strcpy(docker_stop_sh + dirname_length, "/docker-stop.sh");
  system(docker_stop_sh);
  free(docker_stop_sh);
}

int main(int argc, char *argv[])
{
  signal(SIGTERM, signalHandler);
  signal(SIGINT, signalHandler);
  //
  int length = wai_getExecutablePath(NULL, 0, NULL);
  int dirname_length = 0;
  int docker_start_sh_length = length + 16 + 1; // 16 is the length of "/docker-start.sh".
  char *docker_start_sh = (char *)malloc(docker_start_sh_length);
  wai_getExecutablePath(docker_start_sh, length, &dirname_length);
  strcpy(docker_start_sh + dirname_length, "/docker-start.sh");
  system(docker_start_sh);
  free(docker_start_sh);
  //
  pause();
}

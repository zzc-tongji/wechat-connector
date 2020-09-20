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
  int length = wai_getExecutablePath(NULL, 0, NULL);
  int dirname_length = 0;
  char *dirname = (char *)malloc(length);
  wai_getExecutablePath(dirname, length, &dirname_length);
  dirname[dirname_length] = '\0';
  chdir(dirname);
  free(dirname);
  chdir("..");
  return system("yarn start");
}

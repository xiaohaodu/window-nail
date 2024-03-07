#ifndef LOG_H_
#define LOG_H_

#include <napi.h>

class Log
{
public:
  static void LogMessage(Napi::Env env, std::string message);
};

#endif // LOG_H_
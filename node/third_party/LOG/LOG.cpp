#include "LOG.h"

void Log::LogMessage(Napi::Env env, std::string message)
{
  Napi::HandleScope scope(env);

  // 获取全局对象的引用
  Napi::Object global = env.Global();

  // 从全局对象中获取console对象
  Napi::Value console = global.Get("console");

  // 检查console是否存在且为对象类型
  if (!console.IsUndefined() && console.IsObject())
  {
    // 从console对象中获取log方法并转换为Napi::Function类型
    Napi::Function logFunc = console.As<Napi::Object>().Get("log").As<Napi::Function>();

    // 调用log方法并将message参数传入（转化为JavaScript字符串）
    logFunc.Call({Napi::String::New(env, message)});
  }
}
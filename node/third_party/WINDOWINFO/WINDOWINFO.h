#include <napi.h>
#include <windows.h>

class WindowInfo
{
public:
  WindowInfo(Napi::Env env, HWND hwnd)
  {
    std::wstring titleW;
    int length = GetWindowTextLength(hwnd);
    if (length > 0)
    {
      titleW.resize(length + 1);
      GetWindowTextW(hwnd, &titleW[0], static_cast<int>(titleW.size()));
    }

    RECT rect;
    if (!GetWindowRect(hwnd, &rect))
    {
      throw Napi::Error::New(env, "Failed to get window rectangle");
    }

    title_ = WideStringToUtf8(titleW);
    left_ = rect.left;
    top_ = rect.top;
    right_ = rect.right;
    bottom_ = rect.bottom;
    hwnd_ = hwnd;
  }

  // ... 原始的私有方法保留不变 ...
public:
  static std::string WideStringToUtf8(const std::wstring &wideStr)
  {
    int utf8Len = WideCharToMultiByte(CP_UTF8, 0, wideStr.c_str(), static_cast<int>(wideStr.size()), nullptr, 0, nullptr, nullptr);
    if (utf8Len <= 0)
    {
      throw std::runtime_error("Failed to convert wide string to UTF-8");
    }

    std::string utf8Str(utf8Len, '\0');
    WideCharToMultiByte(CP_UTF8, 0, wideStr.c_str(), static_cast<int>(wideStr.size()), &utf8Str[0], utf8Len, nullptr, nullptr);

    return utf8Str;
  }

  Napi::Object ToObject(Napi::Env env) const
  {
    Napi::Object obj = Napi::Object::New(env);
    obj.Set("title", Napi::String::New(env, title_.c_str()));
    obj.Set("address", Napi::Number::New(env, reinterpret_cast<int64_t>(hwnd_)));
    obj.Set("left", Napi::Number::New(env, left_));
    obj.Set("top", Napi::Number::New(env, top_));
    obj.Set("right", Napi::Number::New(env, right_));
    obj.Set("bottom", Napi::Number::New(env, bottom_));
    return obj;
  }

  HWND hwnd_;
  std::string title_;
  int left_, top_, right_, bottom_;
};

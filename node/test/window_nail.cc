#include <gtest/gtest.h>
#include <windows.h>
#include "../window_nail.cc" // 包含你的N-API模块头文件

class WindowNailTest : public ::testing::Test {
protected:
    void SetUp() override {
        testHwnd = CreateWindowExW(0, L"STATIC", L"Test Window", WS_VISIBLE | WS_OVERLAPPEDWINDOW,
            100, 200, 300, 200, NULL, NULL, NULL, NULL);
        ASSERT_TRUE(testHwnd != NULL);
    }

    void TearDown() override {
        if (testHwnd) {
            DestroyWindow(testHwnd);
            testHwnd = NULL;
        }
    }

    HWND testHwnd = nullptr;
};

TEST_F(WindowNailTest, GetForegroundWindowAtPosition) {
    RECT rect;
    GetWindowRect(testHwnd, &rect);

    Napi::Env env;
    // 初始化env（这里省略，因为在gtest环境中初始化Napi::Env可能需要更复杂的逻辑）

    // 调用要测试的函数，并验证结果
    Napi::Object windowInfoObj = GetForegroundWindowAtPosition(env, rect.left, rect.top);

    // 验证返回的对象不是Undefined
    EXPECT_NE(windowInfoObj, env.Undefined());

    // 然后进一步验证title、left、top、width、height等属性是否与预期相符
    // 这里假设GetWindowTitle函数和FillWindowInfo函数正确无误
    std::wstring expectedTitle = L"Test Window";
    int expectedLeft = rect.left;
    int expectedTop = rect.top;

    Napi::String title = windowInfoObj.Get("title").As<Napi::String>();
    std::string actualTitle = title.Utf8Value();
    EXPECT_EQ(actualTitle, WideStringToUtf8(expectedTitle));

    Napi::Number left = windowInfoObj.Get("left").As<Napi::Number>();
    EXPECT_EQ(left.Int32Value(), expectedLeft);

    Napi::Number top = windowInfoObj.Get("top").As<Napi::Number>();
    EXPECT_EQ(top.Int32Value(), expectedTop);
}

int main(int argc, char **argv) {
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
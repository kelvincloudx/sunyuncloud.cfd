@echo off
chcp 65001 >nul
title 瞬云 SunYun Cloud - GitHub 授权与首次代码推送
color 0b

echo ===================================================================
echo   【瞬云 SunYun Cloud】GitHub 浏览器官方安全授权与代码推送
echo   目标仓库: https://github.com/kelvincloudx/sunyuncloud.git
echo   目标分支: main
echo ===================================================================
echo.
echo [第一步] 即将调用 GitHub 官方安全网页授权（无需泄露 Token）
echo.
echo 流程说明：
echo 1. 终端将显示类似 [XXXX-XXXX] 的 8 位一次性授权验证码；
echo 2. 按回车键将自动在默认浏览器中打开授权页面；
echo 3. 在浏览器页面中输入该 8 位验证码，点击 [Continue] 并确认 [Authorize]；
echo 4. 授权成功后，终端将自动完成 Git 证书绑定并推送代码到 main 分支！
echo.
echo -------------------------------------------------------------------
echo 请按任意键开始 GitHub 授权...
echo -------------------------------------------------------------------
pause >nul

echo.
"%LOCALAPPDATA%\Programs\gh\gh.exe" auth login --hostname github.com -p https -w

echo.
echo [第二步] 配置 Git 凭据集成并推送代码...
"%LOCALAPPDATA%\Programs\gh\gh.exe" auth setup-git
"%LOCALAPPDATA%\Programs\Git\cmd\git.exe" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================================
    echo  ★ [推送成功] 恭喜！瞬云网站已成功发布至 GitHub 仓库！
    echo  仓库地址: https://github.com/kelvincloudx/sunyuncloud
    echo ===================================================================
) else (
    echo ===================================================================
    echo  [提示] 推送未完成，请检查浏览器是否已确认点击授权。
    echo ===================================================================
)
echo.
echo 请按任意键退出窗口...
pause >nul

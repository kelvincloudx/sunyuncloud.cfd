@echo off
chcp 65001 >nul
title 推送瞬云网站到 GitHub
echo ========================================================
echo  正在推送 瞬云 (SunYun Cloud) 代码到 GitHub 仓库...
echo  目标仓库: https://github.com/kelvincloudx/sunyuncloud.git
echo  分支: main
echo ========================================================
echo.
"%LOCALAPPDATA%\Programs\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  [成功] 恭喜！代码已成功推送到 GitHub 仓库！
    echo ========================================================
) else (
    echo ========================================================
    echo  [提示] 推送未完成，请检查 GitHub 账号密码或个人访问令牌 (Token)。
    echo ========================================================
)
echo.
pause

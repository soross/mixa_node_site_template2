::����砥� curpath:
@for /f %%i in ("%0") do set curpath=%~dp0

::������ �᭮��� ��६���� ���㦥���
@CALL "%curpath%set_path.bat"

@echo ==================================================
@echo ᮧ���� �६���� ��⠫��� temp � log:
mkdir "temp"
mkdir "temp/log"

@echo ==================================================
@echo ��⠭���� ����ᨬ��⥩ �� package.json:
CALL npm install

@echo ==================================================
@echo ��⠭���� ���譨� ������᪨� js ������⥪ (�१ bower):
CALL bower install

@echo ==================================================
@echo ��
@pause
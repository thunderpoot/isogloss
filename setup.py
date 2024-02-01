import os
from setuptools import setup, find_packages
from setuptools.command.install import install

class CustomInstall(install):
    def run(self):
        install.run(self)
        man_directory = '/usr/local/share/man/man1/'
        if not os.path.exists(man_directory):
            os.makedirs(man_directory)
        os.system(f'cp man/isogloss.1 {man_directory}')

setup(
    name='isogloss',
    version='1.0.2',
    author='underwood (T E Vaughan)',
    author_email='underwood@underwood.network',
    description='A tool for looking up ISO 639 and IETF language codes',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url='https://github.com/thunderpoot/isogloss',
    packages=find_packages(),
    include_package_data=True,
    package_data={
        'isogloss': ['data/*.json'],
    },
    entry_points={
        'console_scripts': [
            'isogloss=isogloss.isogloss:main',
        ],
    },
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: POSIX :: Linux',
        'Operating System :: MacOS :: MacOS X',
    ],
    python_requires='>=3.6',
    cmdclass={
        'install': CustomInstall,
    },
    install_requires=[
        'argparse',
        'json',
        'os',
        'unidecode'
    ]
)

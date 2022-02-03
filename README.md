# Project 1 - DSL ArduinoML

### Execution scenarios internal DSL
* Go to source folder
```sh 
cd embeddeds/groovy/GroovuinoML
```
* Run specific scenario
```sh
./runner.sh <scenario_name> 
ex : ./runner.sh VerySimpleAlarm 
```
**Scenarios list** : ***VerySimpleAlarm - DualCheckAlarm - StateAlarmBased -MultiStateAlarm - ExceptionThrowing - TemporalTransition - UsedPinFail***

you'll see arduino code (.ino) printed in console

### Execution scenarios external DSL
* Generate the new grammar
```sh
npm run langium:generate
```
* Build DSL
```sh
npm run build
```

To launch the extension (after generating the grammar && building dsl) :
* hit F5 button (the langium project must be opened in VS code at its root and not the entire ArduinoML folder)

* This opens a new VScode window allowing to edit .alc with highlighting, auto-completion, static checks...

* To transform an .alc file into an .ino :
```sh
bin/cli generate filename.alc
```

For more details please consult **[report](http://github.com)** 

### Team
- [Rachid EL ADLANI](https://github.com/rachid-eladlani)
- [Valentin Roccelli](https://github.com/RoccelliV)
- [Abdel BELKHIRI](https://github.com/AbdelBelkhiri)
- [Armand FARGEON](https://github.com/armandfargeon)
- [Mohamed FERTALA](https://github.com/fertala2)

##### References

  * [2014] Sébastien Mosser, Philippe Collet, Mireille Blay-Fornarino. _“Exploiting the Internet of Things to Teach Domain-Specific Languages and Modeling”_ in Proceedings of the 10th Educators' Symposium @ MODELS 2014 (EduSymp'14), ACM, IEEE, pages 1-10, Springer LNCS, Valencia, Spain, 29 september 2014
    * [Article](http://www.i3s.unice.fr/~mosser/_media/research/edusymp14.pdf), [Slides](http://www.i3s.unice.fr/~mosser/_media/research/edusymp14_slides.pdf)

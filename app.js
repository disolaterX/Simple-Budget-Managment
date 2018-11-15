var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }

    var Income = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }

    var calculateTotal = function(type){
        var sum = 0 
        data.allItems[type].forEach(function(cur){
            sum += cur.value
        })
        data.totals[type] = sum 
    }

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget : 0,
        percentage : -1

    }

    return{
        addItem : function(type, dec, val) {
            var newItem,ID 
            
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if(type === 'income'){
                newItem = new Expense(ID, dec, val)
            }
            else{
                newItem = new Income(ID, dec, val)
            }

            data.allItems[type].push(newItem)
            return newItem
        },

        deleteItem : function(type, id){
            var ids, index
            
            ids = data.allItems[type].map(function(current){

                return current.id
            })

            index = ids.indexOf(id)

            if(index !== -1){
                data.allItems[type].splice(index,1)
            }
        },
        

        calculateBudget : function(){

            calculateTotal('expense')
            calculateTotal('income')

            data.budget = data.totals.income - data.totals.expense
            if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }     
        },


        getBudget : function(){
            return{
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expense,
                percentage: data.percentage
            }
        },

        testing : function(){
            console.log(data)
        }
    }

})()

var uiController = (function(){

    var DOMstrings = {
        inputType : '.add__type',
        inputDec : '.add__description',
        inputVal : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetValue : '.budget__value',
        totalInc : '.budget__income--value',
        totalExp : '.budget__expenses--value',
        budgetPercentage : '.budget__expenses--percentage',
        dateLabel : '.budget__title--month',
        container : '.container'

    }

    return {
        getInput : function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value, //inc or exp is op
                description : document.querySelector(DOMstrings.inputDec).value,
                value : parseFloat(document.querySelector(DOMstrings.inputVal).value)
            }
        },

        addListItem : function(obj , type){

            var newHtml, html, element

            if (type === 'income'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } 

            else{
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%',obj.id)
            newHtml = newHtml.replace('%description%',obj.description)
            newHtml = newHtml.replace('%value%',obj.value)

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

        },

        deleteListItem : function(selectorID){

            var el =  document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },

        clearFilds : function(){
            var field
            field = document.querySelectorAll(DOMstrings.inputDec+','+DOMstrings.inputVal)
            var fieldArr = Array.prototype.slice.call(field)

            fieldArr.forEach(function(current, index, array){

                current.value = ""
                
                
            })
            fieldArr[0].focus() 
        },

        displayBudget : function(obj){
            document.querySelector(DOMstrings.budgetValue).textContent = obj.budget
            document.querySelector(DOMstrings.totalInc).textContent = obj.totalInc
            document.querySelector(DOMstrings.totalExp).textContent = obj.totalExp

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.budgetPercentage).textContent = obj.percentage + '%'
            }
            else{
                document.querySelector(DOMstrings.budgetPercentage).textContent = '-'
            }

 

        },

        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        getDOMstrings : function(){
            return DOMstrings
        }
    }

})()


var controller = (function(bugCtrl,uiCtrl){

    var setUpEventListner = function(){

        var DOM = uiCtrl.getDOMstrings() 

        document.querySelector(DOM.inputBtn).addEventListener('click',function(){
            console.log('button is pressed')
            addCtrlAddItem()
        })
    
        document.addEventListener('keypress',function(event){
    
            if(event.keyCode === 13 || event.which === 13){
                console.log('enter is pressed')
                addCtrlAddItem()
            }
        })

        document.querySelector(DOM.container).addEventListener('click', function(event){
            removeCtrlRemoveItem(event)
        })
    }


    var updateBuget = function(){
        budgetController.calculateBudget()

        var budget = budgetController.getBudget()
        
         uiCtrl.displayBudget(budget)
         
    }

    var updatePercentage = function(){
        budgetController.calculatePercentage()
        var percentage = budgetController.getPercentages()
        uiController.displayPercentages(percentages);

    }

    var removeCtrlRemoveItem = function(event){
        var itemID , splitID
        itemID =  event.target.parentNode.parentNode.parentNode.id
        console.log(itemID)

        if(itemID){
        
            splitID = itemID.split('-')
            type = splitID[0]
            id = parseInt(splitID[1]) 
        }

        budgetController.deleteItem(type,id)
        uiController.deleteListItem(itemID)

        updateBuget()
        updatePercentage()

    }

    var addCtrlAddItem = function(){

        var input , newItem
        input = uiCtrl.getInput()
        console.log(input)
        if(input.description !== '' && !isNaN(input.value && input.value >0 ) ){
            newItem = budgetController.addItem(input.type, input.description, input.value)
            uiCtrl.addListItem(newItem, input.type)
            uiCtrl.clearFilds()
            updateBuget()
            updatePercentage()
        }
        else{
            alert('Pleses Enter COrrect Data ')
        }
        

    }

    return{
        init : function() {
            console.log('app started')
            uiController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            uiController.displayMonth();
            setUpEventListner()
        }
    }
     
    
})(budgetController,uiController)

controller.init()

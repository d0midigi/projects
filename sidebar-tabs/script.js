const collapse = function(willCollapse = true, callback = (list) => {}) {
  this.collapsing = true;
  const height = this.scrollHeight;
  const stateFrom = {height: height + 'px'};
  const stateTo = {height: '0px'};
  
  let animateState = [stateFrom, stateTo];
  if(!willCollapse) animateState = [stateTo, stateFrom];
  
  this.animate(animateState,{
    duration:500,
    iterations:1,
    easing:'ease-in-out'
  }).finished.then(val => {
    this.collapsing = false;
    if(callback && typeof(callback) == 'function'){
      callback(this);
    }
  });
}
const showActiveTab = (tab) => {
  if(tab){
    document.querySelector('#active-tab').textContent = tab.textContent;
  }
}
showActiveTab(document.querySelector('.list-item.active'));

document.querySelectorAll('.list li').forEach(li => {
    const list = li.querySelector('.list');
    if(list)list.collapse = collapse.bind(list);
    li.querySelector('.list-item').addEventListener('click', (event) => {
        // if not a list (just list-item)
        if(!list){
          document.querySelectorAll('.list-item').forEach(listItem => {
            listItem.classList.remove('active');
          });
          event.target.classList.add('active');
          showActiveTab(event.target);
          event.preventDefault();
          return;
        }
        // if list still collapsing
        if(list.collapsing){
            event.preventDefault();
            return;
        }
        // set list collapse or open
        if(!list.classList.contains('open')) {
            list.classList.add('open')
            list.querySelectorAll('.list').forEach(oList => oList.classList.remove('open'));
            list.parentElement.parentElement.querySelectorAll('& > li > .list.open').forEach(oList => {
              if(oList !== list){
                oList.collapse(true, ls => {
                    ls.querySelectorAll('.list').forEach(oList => oList.classList.remove('open'));
                    ls.classList.remove('open');
                });
              }
            });
            // open
            list.collapse(false);
        } else {
            // collapse
            list.collapse(true, ls => {
                ls.querySelectorAll('.list').forEach(oList => oList.classList.remove('open'));
                ls.classList.remove('open');
            });
        }
    })
})